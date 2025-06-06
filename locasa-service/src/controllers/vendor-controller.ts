import { Request, Response } from "express";
import { Brand, Product, Order } from "../database";
import { successResponse, errorResponse } from "../utils";
import { Types } from "mongoose";

// Brand Controllers
export const addBrand = async (req: Request, res: Response) => {
  try {
    const vendorId = req.user?.user_id;
    const brandData = { ...req.body, vendor: vendorId };

    const brand = await Brand.create(brandData);
    return successResponse(res, "backend.brand_created", { brand });
  } catch (error) {
    console.error("Error adding brand:", error);
    return errorResponse(res, "backend.failed_to_create_brand", 500);
  }
};

export const editBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;

    const brand = await Brand.findOneAndUpdate(
      { _id: id, vendor: vendorId },
      { $set: req.body },
      { new: true }
    );

    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    return successResponse(res, "backend.brand_updated", { brand });
  } catch (error) {
    console.error("Error updating brand:", error);
    return errorResponse(res, "backend.failed_to_update_brand", 500);
  }
};

export const getBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?.user_id;

    const brand = await Brand.findOne({ _id: id, vendor: vendorId });
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

    const brand = await Brand.findOneAndDelete({ _id: id, vendor: vendorId });
    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    // Delete associated products
    await Product.deleteMany({ brand: id });

    return successResponse(res, "backend.brand_deleted");
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

    const product = await Product.create(productData);
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

    const product = await Product.findOneAndUpdate(
      { _id: id, vendor: vendorId },
      { $set: req.body },
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
    const products = await Product.find({ vendor: vendorId }).populate("brand");
    return successResponse(res, "backend.products_found", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse(res, "backend.failed_to_fetch_products", 500);
  }
};

export const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const { brand_id } = req.params;
    const vendorId = req.user?.user_id;

    const brand = await Brand.findOne({ _id: brand_id, vendor: vendorId });
    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    const products = await Product.find({ brand: brand_id });
    return successResponse(res, "backend.products_found", { products });
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
    }).populate("brand");
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
    const orders = await Order.find({ "brand.vendor": vendorId })
      .populate("product")
      .populate("client")
      .populate("brand");
    return successResponse(res, "backend.orders_found", { orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return errorResponse(res, "backend.failed_to_fetch_orders", 500);
  }
};

export const getOrdersByBrand = async (req: Request, res: Response) => {
  try {
    const { brand_id } = req.params;
    const vendorId = req.user?.user_id;

    const brand = await Brand.findOne({ _id: brand_id, vendor: vendorId });
    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    const orders = await Order.find({ brand: brand_id })
      .populate("product")
      .populate("client")
      .populate("brand");
    return successResponse(res, "backend.orders_found", { orders });
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
      .populate("product")
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
      .populate("product")
      .populate("client")
      .populate("brand");

    if (!order) {
      return errorResponse(res, "backend.order_not_found", 404);
    }

    return successResponse(res, "backend.order_found", { order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return errorResponse(res, "backend.failed_to_fetch_order", 500);
  }
};
