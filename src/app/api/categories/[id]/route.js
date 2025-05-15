import connectDB from "@/lib/dbConnect";
import categoryModels from "@/models/categoryModels";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    console.info("[GET] /api/category/:id - Initiating request");

    console.info("[DB] Connecting to the database...");
    await connectDB();
    console.info("[DB] Successfully connected.");

    const { id: categoryName } = params; // ✅ Use id from params
    console.debug(`[PARAMS] Received categoryName: ${categoryName}`);

    if (!categoryName) {
      console.error("[ERROR] Missing 'categoryName' in request parameters.");
      return NextResponse.json({ msg: "Category name is required" }, { status: 400 });
    }

    const category = await categoryModels.findOne({ name: categoryName });

    if (!category) {
      console.warn(`[WARN] Category '${categoryName}' not found in database.`);
      return NextResponse.json({ msg: "Category not found" }, { status: 404 });
    }

    const subcategories = await subCategoryModels.find({ category: category._id }).lean();

    return NextResponse.json({
      category,
      subcategories,
      count: subcategories.length,
    }, { status: 200 });

  } catch (error) {
    console.error(`[ERROR] Failed to fetch subcategories:`, error);
    return NextResponse.json(
      { msg: "Error finding subcategories", error: error.message },
      { status: 500 }
    );
  }
};
