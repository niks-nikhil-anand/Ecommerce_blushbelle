import connectDB from "@/lib/dbConnect";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";

// Accept dynamic route: /api/admin/dashboard/category/AllSubCatgeory/[categoryId]
export const GET = async (req, { params }) => {
  try {
    console.log("[API] Connecting to the database...");
    await connectDB();
    console.log("[API] Connected to the database.");

    const categoryId = params.categoryId;
    console.log("[API] Received categoryId:", categoryId);

    if (!categoryId) {
      return NextResponse.json({ msg: "Category ID is required" }, { status: 400 });
    }

    // Find subcategories that belong to the category
    const subcategories = await subCategoryModels.find({ category: categoryId }).lean();

    console.log("[API] Found subcategories:", subcategories.length);

    return NextResponse.json({ subcategories, count: subcategories.length }, { status: 200 });

  } catch (error) {
    console.error("[API] Error fetching subcategories:", error);
    return NextResponse.json(
      { msg: "Error fetching subcategories", error: error.message },
      { status: 500 }
    );
  }
};
