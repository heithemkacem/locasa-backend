// cron/syncTypesense.ts
import mongoose from "mongoose";
import { typesense } from "../../services/TypeSenseClient";
import Product from "../models/product/product";
import Brand from "../models/brand/brand";

export const syncTypeSense = async () => {
  try {
    const collections = await typesense.collections().retrieve();
    const collectionNames = collections.map((col: any) => col.name);

    if (!collectionNames.includes("products")) {
      await typesense.collections().create({
        name: "products",
        fields: [
          { name: "id", type: "string" },
          { name: "name", type: "string" },
          { name: "category", type: "string", facet: true },
          { name: "brand", type: "string", facet: true },
        ],
      });
    }

    if (!collectionNames.includes("brands")) {
      await typesense.collections().create({
        name: "brands",
        fields: [
          { name: "id", type: "string" },
          { name: "name", type: "string" },
        ],
      });
    }

    const products = await Product.find().lean();
    const productDocs = products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      brand: p.name,
    }));

    await typesense
      .collections("products")
      .documents()
      .import(productDocs, { action: "upsert" });

    const brands = await Brand.find().lean();
    const brandDocs = brands.map((b) => ({
      id: b._id.toString(),
      name: b.name,
    }));

    await typesense
      .collections("brands")
      .documents()
      .import(brandDocs, { action: "upsert" });

    console.log("✅ Synced Products & Brands to Typesense");
  } catch (err) {
    console.error("❌ Sync error", err);
  } finally {
    await mongoose.disconnect();
  }
};
