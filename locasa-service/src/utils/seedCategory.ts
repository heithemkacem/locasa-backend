import mongoose from "mongoose";
import { Category } from "../database";

const categories = [
  {
    id: "fashion",
    name: "Fashion & Apparel",
    subcategories: [
      "Clothing",
      "Shoes",
      "Accessories",
      "Jewelry",
      "Watches",
      "Bags & Luggage",
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    subcategories: [
      "Skincare",
      "Makeup",
      "Hair Care",
      "Fragrances",
      "Personal Hygiene",
      "Wellness",
    ],
  },
  {
    id: "technology",
    name: "Technology & Electronics",
    subcategories: [
      "Smartphones",
      "Computers",
      "Gaming",
      "Audio",
      "Smart Home",
      "Wearables",
    ],
  },
  {
    id: "food",
    name: "Food & Beverages",
    subcategories: [
      "Restaurants",
      "Fast Food",
      "Coffee & Tea",
      "Alcoholic Beverages",
      "Snacks",
      "Organic Foods",
    ],
  },
  {
    id: "automotive",
    name: "Automotive",
    subcategories: [
      "Car Manufacturers",
      "Motorcycles",
      "Auto Parts",
      "Car Services",
      "Electric Vehicles",
    ],
  },
  {
    id: "home",
    name: "Home & Living",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Kitchen & Dining",
      "Bedding",
      "Appliances",
      "Garden & Outdoor",
    ],
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    subcategories: [
      "Athletic Wear",
      "Equipment",
      "Outdoor Gear",
      "Fitness",
      "Team Sports",
      "Individual Sports",
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment & Media",
    subcategories: [
      "Streaming Services",
      "Gaming",
      "Music",
      "Movies",
      "Books",
      "Social Media",
    ],
  },
  {
    id: "travel",
    name: "Travel & Hospitality",
    subcategories: [
      "Airlines",
      "Hotels",
      "Car Rental",
      "Travel Booking",
      "Cruises",
      "Tour Operators",
    ],
  },
  {
    id: "finance",
    name: "Financial Services",
    subcategories: [
      "Banks",
      "Insurance",
      "Investment",
      "Credit Cards",
      "Fintech",
      "Cryptocurrency",
    ],
  },
  {
    id: "health",
    name: "Healthcare & Medical",
    subcategories: [
      "Pharmaceuticals",
      "Medical Devices",
      "Hospitals",
      "Telemedicine",
      "Mental Health",
      "Supplements",
    ],
  },
  {
    id: "education",
    name: "Education & Learning",
    subcategories: [
      "Online Learning",
      "Universities",
      "K-12 Education",
      "Professional Training",
      "Language Learning",
    ],
  },
  {
    id: "retail",
    name: "Retail & E-commerce",
    subcategories: [
      "Department Stores",
      "Online Marketplaces",
      "Specialty Retail",
      "Discount Stores",
      "Luxury Retail",
    ],
  },
  {
    id: "professional",
    name: "Professional Services",
    subcategories: [
      "Consulting",
      "Legal Services",
      "Accounting",
      "Marketing",
      "Real Estate",
      "Architecture",
    ],
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    subcategories: [
      "Oil & Gas",
      "Renewable Energy",
      "Electric Utilities",
      "Solar",
      "Wind Power",
      "Battery Technology",
    ],
  },
  {
    id: "telecommunications",
    name: "Telecommunications",
    subcategories: [
      "Mobile Carriers",
      "Internet Providers",
      "Cable TV",
      "Satellite",
      "VoIP Services",
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    subcategories: [
      "Heavy Machinery",
      "Tools",
      "Construction",
      "Chemicals",
      "Materials",
      "Packaging",
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture & Food Production",
    subcategories: [
      "Farming Equipment",
      "Seeds & Fertilizers",
      "Organic Farming",
      "Livestock",
      "Food Processing",
    ],
  },
  {
    id: "nonprofit",
    name: "Non-Profit & Social Impact",
    subcategories: [
      "Charities",
      "Environmental",
      "Social Causes",
      "Religious Organizations",
      "Foundations",
    ],
  },
  {
    id: "pets",
    name: "Pets & Animals",
    subcategories: [
      "Pet Food",
      "Pet Supplies",
      "Veterinary Services",
      "Pet Insurance",
      "Pet Grooming",
    ],
  },
  {
    id: "luxury",
    name: "Luxury Goods",
    subcategories: [
      "High-End Fashion",
      "Luxury Cars",
      "Premium Jewelry",
      "Fine Dining",
      "Luxury Travel",
      "Art & Collectibles",
    ],
  },
  {
    id: "other",
    name: "Other",
    subcategories: ["Government", "Military", "Research", "Miscellaneous"],
  },
];

export async function seedCategories() {
  try {
    // Connect to MongoDB

    // Clear existing categories (optional)
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Insert new categories
    const result = await Category.insertMany(categories);
    console.log(`Successfully inserted ${result.length} categories`);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}
