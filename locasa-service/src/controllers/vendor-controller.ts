import { Request, Response } from "express";
import mongoose from "mongoose";
import { Brand, Product, Order, Location, Vendor, Category } from "../database";
import { successResponse, errorResponse } from "../utils";
import {
  getPaginationOptions,
  paginateArray,
  paginateQuery,
} from "../utils/pagination";
import { s3Client } from "../config/aws";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config";
import { rabbitMQService } from "../services/RabbitMQService";

// Brand Controllers
export const addBrand = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user?.user_id;
    const { location: locationData, ...brandDetails } = req.body;

    // Handle logo upload if present
    let logoUrl;
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const key = `brands/${vendorId}/${Date.now()}.${fileExt}`;

      const command = new PutObjectCommand({
        Bucket: config.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);
      logoUrl = `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;
    }

    // First create the location
    const locationDoc = await Location.create({
      ...locationData,
      type: "brand",
      profile: req.user?.id, // Link to vendor's profile
    });

    // Then create the brand with the location reference
    const brandData = {
      ...brandDetails,
      vendor: vendorId,
      location: locationDoc._id,
      logo: logoUrl || brandDetails.logo, // Use uploaded logo URL if available
    };

    const brand = await Brand.create(brandData);

    // Add the brand to vendor's brands array
    await Vendor.findByIdAndUpdate(vendorId, {
      $push: { brands: brand._id },
    });
    await rabbitMQService.notifyReceiver(
      "684684e331c712b1cbcddf12",
      "New brand has joined !",
      `${brand.name} has joined us!`,
      {
        url: {
          pathname: `/(client)/(screens)/brands/${brand._id}/brand`,
        },
      }
    );
    return successResponse(res, "backend.brand_created", {
      brand: {
        ...brand.toObject(),
        location: locationDoc,
      },
    });
  } catch (error) {
    console.error("Error adding brand:", error);
    return errorResponse(res, "backend.failed_to_create_brand", 500);
  }
};

export const editBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;
    const { location: locationData, ...brandDetails } = req.body;

    // First find the brand to ensure it exists and belongs to the vendor
    const existingBrand = await Brand.findOne({ _id: id, vendor: vendorId });
    if (!existingBrand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    // Handle logo upload if present
    let logoUrl = brandDetails.logo;
    if (req.file) {
      // Delete old logo if it exists
      if (existingBrand.logo) {
        try {
          // Extract the key from the existing logo URL
          const oldLogoUrl = new URL(existingBrand.logo);
          const oldKey = oldLogoUrl.pathname.substring(1); // Remove leading slash

          const deleteCommand = new DeleteObjectCommand({
            Bucket: config.AWS_BUCKET_NAME,
            Key: oldKey,
          });
          await s3Client.send(deleteCommand);
        } catch (error) {
          console.error("Error deleting old logo:", error);
          // Continue execution even if delete fails
        }
      }

      // Upload new logo
      const fileExt = req.file.originalname.split(".").pop();
      const key = `brands/${vendorId}/${Date.now()}.${fileExt}`;

      const command = new PutObjectCommand({
        Bucket: config.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(command);
      logoUrl = `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;
    }

    // If location data is provided, update the location
    if (locationData) {
      await Location.findByIdAndUpdate(
        existingBrand.location,
        {
          $set: {
            ...locationData,
            type: "brand", // Ensure type remains brand
          },
        },
        { new: true }
      );
    }

    // Update the brand with new logo URL if present
    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        $set: {
          ...brandDetails,
          logo: logoUrl,
        },
      },
      { new: true }
    ).populate("location");
    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    return successResponse(res, "backend.brand_updated", { brand });
  } catch (error) {
    console.error("Error updating brand:", error);
    return errorResponse(res, "backend.failed_to_update_brand", 500);
  }
};
export const getBrands = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user?.user_id;
    const paginationOptions = getPaginationOptions(req);
    console.log(req.user);
    const vendor = await Vendor.findById(vendorId).populate({
      path: "brands",
      populate: {
        path: "products",
        select: "_id", // Only select _id to minimize data transfer
      },
      select: "_id name logo products", // Only select needed fields from brands
    });

    if (!vendor) {
      return errorResponse(res, "backend.vendor_not_found", 404);
    }

    // Transform brands data to include product count
    const brandsWithProductCount = vendor.brands.map((brand) => ({
      _id: brand._id, // Fixed: should be _id, not *id
      name: brand.name,
      logo: brand.logo,
      numberOfProducts: brand.products ? brand.products.length : 0,
    }));

    // Use paginateArray for JavaScript arrays
    const result = paginateArray(brandsWithProductCount, paginationOptions);

    return successResponse(res, "backend.brands_found", result);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return errorResponse(res, "backend.failed_to_fetch_brands", 500);
  }
};
export const getBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;
    const brand = await Brand.findOne({ _id: id, vendor: vendorId })
      .populate("products")
      .populate("location")
      .populate("category");

    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }
    return successResponse(res, "backend.brand_found", { brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return errorResponse(res, "backend.failed_to_fetch_brand", 500);
  }
};
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;

    // First check if the vendor exists and owns this brand
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return errorResponse(res, "backend.vendor_not_found", 404);
    }

    // Verify that the brand exists in vendor's brands array
    if (!vendor.brands.some((brandId) => brandId.toString() === id)) {
      return errorResponse(res, "backend.unauthorized_brand_access", 403);
    }

    // Find the brand to get the location ID and double check ownership
    const brand = await Brand.findOne({ _id: id, vendor: vendorId });
    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    // Delete operations sequentially (without transaction)
    try {
      // Delete associated products
      await Product.deleteMany({ brand: id });

      // Delete the associated location
      if (brand.location) {
        await Location.findByIdAndDelete(brand.location);
      }

      // Remove brand from vendor's brands array
      await Vendor.findByIdAndUpdate(vendorId, {
        $pull: { brands: id },
      });

      // Delete the brand
      await Brand.findByIdAndDelete(id);

      return successResponse(res, "backend.brand_deleted");
    } catch (deleteError) {
      console.error("Error during brand deletion operations:", deleteError);
      return errorResponse(res, "backend.failed_to_delete_brand", 500);
    }
  } catch (error) {
    console.error("Error deleting brand:", error);
    return errorResponse(res, "backend.failed_to_delete_brand", 500);
  }
};

// Product Controllers
export const addProduct = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user?.user_id;
    const productData = { ...req.body, vendor: vendorId };

    // Verify that the brand belongs to the vendor
    const brand = await Brand.findOne({
      _id: productData.brand,
      vendor: vendorId,
    });

    if (!brand) {
      return errorResponse(res, "backend.invalid_brand", 400);
    }

    // Handle image uploads
    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const fileExt = file.originalname.split(".").pop();
        const key = `products/${vendorId}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const command = new PutObjectCommand({
          Bucket: config.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await s3Client.send(command);
        const imageUrl = `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;
        imageUrls.push(imageUrl);
      }
    }

    // Create product with image URLs
    const product = await Product.create({
      ...productData,
      images: imageUrls,
    });

    await Brand.findByIdAndUpdate(productData.brand, {
      $push: { products: product._id },
    });

    return successResponse(res, "backend.product_created", { product });
  } catch (error) {
    console.error("Error adding product:", error);
    return errorResponse(res, "backend.failed_to_create_product", 500);
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;

    // First find the existing product
    const existingProduct = await Product.findOne({
      _id: id,
      vendor: vendorId,
    });
    if (!existingProduct) {
      return errorResponse(res, "backend.product_not_found", 404);
    }

    // If changing brand, verify new brand belongs to vendor
    if (req.body.brand) {
      const brand = await Brand.findOne({
        _id: req.body.brand,
        vendor: vendorId,
      });
      if (!brand) {
        return errorResponse(res, "backend.invalid_brand", 400);
      }
    }

    // Handle image uploads if present
    let imageUrls = existingProduct.images || [];
    if (req.files && Array.isArray(req.files)) {
      // Delete existing images from S3
      for (const imageUrl of imageUrls) {
        try {
          const oldUrlObj = new URL(imageUrl);
          const oldKey = oldUrlObj.pathname.substring(1);
          const deleteCommand = new DeleteObjectCommand({
            Bucket: config.AWS_BUCKET_NAME,
            Key: oldKey,
          });
          await s3Client.send(deleteCommand);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload new images
      imageUrls = [];
      for (const file of req.files) {
        const fileExt = file.originalname.split(".").pop();
        const key = `products/${vendorId}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const command = new PutObjectCommand({
          Bucket: config.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await s3Client.send(command);
        const imageUrl = `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;
        imageUrls.push(imageUrl);
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, vendor: vendorId },
      {
        $set: {
          ...req.body,
          images: imageUrls,
        },
      },
      { new: true }
    );

    if (!product) {
      return errorResponse(res, "backend.product_not_found", 404);
    }

    return successResponse(res, "backend.product_updated", { product });
  } catch (error) {
    console.error("Error updating product:", error);
    return errorResponse(res, "backend.failed_to_update_product", 500);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user?.user_id;
    const paginationOptions = getPaginationOptions(req);

    const query = Product.find({ vendor: vendorId })
      .select("_id name brand images") // Only select id and name from Product
      .populate({
        path: "brand",
        select: "name", // Only select name from Brand
      })
      .sort({ createdAt: -1 });

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.products_found", result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse(res, "backend.failed_to_fetch_products", 500);
  }
};
export const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const { brand_id } = req.params;
    const vendorId = req.user?.user_id;
    const paginationOptions = getPaginationOptions(req);

    const brand = await Brand.findOne({ _id: brand_id, vendor: vendorId });
    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    const query = Product.find({ brand: brand_id })
      .populate("brand")
      .sort({ createdAt: -1 });

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.products_found", result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse(res, "backend.failed_to_fetch_products", 500);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;

    const product = await Product.findOne({
      _id: id,
      vendor: vendorId,
    }).populate("brand category");
    if (!product) {
      return errorResponse(res, "backend.product_not_found", 404);
    }

    return successResponse(res, "backend.product_found", { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return errorResponse(res, "backend.failed_to_fetch_product", 500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;

    const product = await Product.findOneAndDelete({
      _id: id,
      vendor: vendorId,
    });
    if (!product) {
      return errorResponse(res, "backend.product_not_found", 404);
    }

    // Remove product from brand's products array
    await Brand.findByIdAndUpdate(product.brand, {
      $pull: { products: product._id },
    });

    return successResponse(res, "backend.product_deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    return errorResponse(res, "backend.failed_to_delete_product", 500);
  }
};

// Order Controllers
export const getOrders = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user?.user_id;
    const paginationOptions = getPaginationOptions(req);

    const query = Order.find({ "brand.vendor": vendorId })
      .populate("products.product", "name")
      .populate("client", "name phone")
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.orders_found", result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return errorResponse(res, "backend.failed_to_fetch_orders", 500);
  }
};
export const getCategories = async (req: Request, res: Response) => {
  try {
    const paginationOptions = getPaginationOptions(req);

    const query = Category.find();

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.categories_found", result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse(res, "backend.failed_to_fetch_categories", 500);
  }
};
export const getOrdersByBrand = async (req: Request, res: Response) => {
  try {
    const { brand_id } = req.params;
    const vendorId = req.user?.user_id;
    const paginationOptions = getPaginationOptions(req);

    const brand = await Brand.findOne({ _id: brand_id, vendor: vendorId });
    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    const query = Order.find({ brand: brand_id })
      .populate("products.product")
      .populate("client")
      .populate("brand")
      .sort({ createdAt: -1 });

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.orders_found", result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return errorResponse(res, "backend.failed_to_fetch_orders", 500);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const vendorId = req.user?.user_id;

    const order = await Order.findOneAndUpdate(
      { _id: id, "brand.vendor": vendorId },
      { $set: { orderStatus: status } },
      { new: true }
    )
      .populate("products.product")
      .populate("client")
      .populate("brand");

    if (!order) {
      return errorResponse(res, "backend.order_not_found", 404);
    }

    return successResponse(res, "backend.order_status_updated", { order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return errorResponse(res, "backend.failed_to_update_order_status", 500);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;

    const order = await Order.findOne({ _id: id, "brand.vendor": vendorId })
      .populate("products.product")
      .populate("client")
      .populate("brand")
      .populate("location");

    if (!order) {
      return errorResponse(res, "backend.order_not_found", 404);
    }

    return successResponse(res, "backend.order_found", { order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return errorResponse(res, "backend.failed_to_fetch_order", 500);
  }
};
