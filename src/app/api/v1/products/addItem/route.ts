import { z } from "zod";
import slugify from "slugify";
import { NextResponse } from "next/server";
import ConnectDb from "@/utils/connect";
import mongoose from "mongoose";
import logger from "@/utils/logger";
import { ProductModel } from "@/models/schema";

const productSchema = z.object({
  title: z.string().min(3, "title must be at least 3 characters"),
  description: z.string().min(3, "description must be at least 3 characters"),
  price: z.number().min(1, "price must be at least 1"),
  image: z.array(z.string().min(1, "image must be at least 1")),
  category: z.array(z.string().min(1, "category must be at least 1")),
  isOnSale: z.boolean().optional().default(false),
  available: z.boolean().optional().default(true),
  isNewItem: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
  tags: z.array(z.string().min(1, "tags must be at least 1")),
  rating: z.number().optional().default(0),
  stock: z.number().min(1, "stock must be at least 1"),
  comments: z.array(z.string()).optional().default([]),
  reviews: z.array(z.string()).optional().default([]),
  sku: z.string().default(""),
  slug: z.string().default(""),
  details: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  colors: z.array(z.string().min(1, "color must be at least 1 ")).default([]),
  models: z.array(z.string().min(1, "models should be at least 1")).default([]),
  discount: z.number().optional().default(0),
  salesStartAt: z.coerce.date().optional().nullable(),
  salesEndAt: z.coerce.date().optional().nullable(),
});

const generateSku = (title: string, price: number, category: string[]) => {
  const titlePrefix = title.slice(0, 3).toUpperCase();
  const pricePrefix = price.toString().slice(0, 3).toUpperCase();
  const categoryPrefix = category[0].slice(0, 3).toUpperCase();
  const sku = `${titlePrefix}-${pricePrefix}-${categoryPrefix}`;
  return sku;
};

const generateSlug = (title: string) => {
  return slugify(title, { lower: true, strict: true });
};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validateProduct = productSchema.parse(data);
    if (!validateProduct) {
      return NextResponse.json(
        {
          message: "invalid product data",
        },
        {
          status: 400,
        },
      );
    }
    if (mongoose.connection.readyState !== 1) {
      await ConnectDb();
    }
    //* generate Sku
    const generatedSku = generateSku(
      validateProduct.title,
      validateProduct.price,
      validateProduct.category,
    );

    //*generate slug
    const generatedSlug = generateSlug(validateProduct.title);

    const newItem = await ProductModel.create({
      ...validateProduct,
      slug: generatedSlug,
      sku: generatedSku,
    });
    if (!newItem) {
      logger.error("Failed to create product", {
        error: "Failed to create product",
      });
    }
    logger.info("product successfully added", {
      productId: newItem._id,
      productTitle: newItem.title,
    });
    return NextResponse.json({
      message: "product successfully added",
      product: newItem,
    });
  } catch (error) {
    logger.error(
      `Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return NextResponse.json(
      {
        message: "Failed to create product",
      },
      {
        status: 500,
      },
    );
  }
}
