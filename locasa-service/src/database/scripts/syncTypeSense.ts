// cron/syncTypesense.ts
import mongoose from "mongoose";
import { typesense } from "../../services/TypeSenseClient";
import Product from "../models/product/product";
import Brand from "../models/brand/brand";

export const syncTypeSense = async () => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ Database not connected, skipping TypeSense sync");
      return;
    }

    console.log("🔍 Starting TypeSense sync...");
    const collections = await typesense.collections().retrieve();
    const collectionNames = collections.map((col: any) => col.name);

    if (!collectionNames.includes("products")) {
      await typesense.collections().create({
        name: "products",
        fields: [
          { name: "id", type: "string" },
          { name: "type", type: "string" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "category", type: "string", facet: true },
          { name: "price", type: "float" },
          { name: "brand", type: "string", facet: true },
          { name: "brandId", type: "string" },
          { name: "image", type: "string" },
        ],
      });
    }

    if (!collectionNames.includes("brands")) {
      await typesense.collections().create({
        name: "brands",
        fields: [
          { name: "id", type: "string" },
          { name: "type", type: "string" },
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "image", type: "string" },
          { name: "productCount", type: "int32" },
        ],
      });
    }

    // Sync products with populated brand information
    const products = await Product.find()
      .populate("brand", "name")
      .populate("category", "name")
      .lean();

    const productDocs = products.map((p: any) => ({
      id: p._id.toString(),
      type: "product",
      name: p.name,
      description: p.description || "",
      category: p.category?.name || "",
      price: p.price,
      brand: p.brand?.name || "",
      brandId: p.brand?._id?.toString() || "",
      image: p.images && p.images.length > 0 ? p.images[0] : "",
    }));

    await typesense
      .collections("products")
      .documents()
      .import(productDocs, { action: "upsert" });

    // Sync brands with product count
    const brands = await Brand.find().lean();
    const brandDocs = await Promise.all(
      brands.map(async (b: any) => {
        const productCount = await Product.countDocuments({ brand: b._id });
        return {
          id: b._id.toString(),
          type: "brand",
          name: b.name,
          description: b.description || "",
          image: b.logo || "",
          productCount,
        };
      })
    );

    await typesense
      .collections("brands")
      .documents()
      .import(brandDocs, { action: "upsert" });

    console.log("✅ Synced Products & Brands to Typesense");
  } catch (err) {
    console.error("❌ Sync error", err);
  }
};
