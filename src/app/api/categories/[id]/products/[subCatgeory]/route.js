import connectDB from "@/lib/dbConnect";
import categoryModels from "@/models/categoryModels";
import subCategoryModels from "@/models/subCategoryModels";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    console.info("[GET] /api/category/:category/products/:subcategory - Start");

    await connectDB();
    console.info("[DB] Connected");

    console.log(params)

    const rawCategory = params.id?.replace(/-/g, " ");
    const rawSubcategory = params.subCatgeory?.replace(/-/g, " ");

    if (!rawCategory || !rawSubcategory) {
      console.warn("[WARN] Missing category or subcategory", { rawCategory, rawSubcategory });
      return NextResponse.json({ msg: "Missing category or subcategory" }, { status: 400 });
    }

    console.debug("[Params] Category:", rawCategory);
    console.debug("[Params] Subcategory:", rawSubcategory);

    console.info("[DB] Querying Category:", rawCategory);
    const category = await categoryModels.findOne({
      name: { $regex: new RegExp(`^${rawCategory}$`, "i") },
    });

    if (!category) {
      console.warn(`[WARN] Category '${rawCategory}' not found`);
      return NextResponse.json({ msg: "Category not found" }, { status: 404 });
    }
    console.info("[DB] Category found:", category._id);

    console.info("[DB] Querying Subcategory:", rawSubcategory);
    const subcategory = await subCategoryModels.findOne({
      name: { $regex: new RegExp(`^${rawSubcategory}$`, "i") },
      category: category._id,
    });

    if (!subcategory) {
      console.warn(`[WARN] Subcategory '${rawSubcategory}' not found`);
      return NextResponse.json({ msg: "Subcategory not found" }, { status: 404 });
    }
    console.info("[DB] Subcategory found:", subcategory._id);

    console.info("[DB] Fetching products for category and subcategory");
    const products = await productModels.find({
      category: category._id,
      subCatgeory: subcategory._id,
    }).lean();

    console.info(`[SUCCESS] Found ${products.length} products`);

    return NextResponse.json({ products, count: products.length }, { status: 200 });

  } catch (error) {
    console.error("[ERROR] Failed to fetch products:", error);
    return NextResponse.json(
      { msg: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
};
