import connectDB from "@/lib/dbConnect";
import categoryModels from "@/models/categoryModels";
import { NextResponse } from "next/server";

// DELETE /api/admin/dashboard/category/:id
export const DELETE = async (req, { params }) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const categoryId = params.id;

    if (!categoryId) {
      console.error("Missing category ID.");
      return NextResponse.json({ msg: "Category ID is required" }, { status: 400 });
    }

    const deletedCategory = await categoryModels.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      console.warn("Category not found.");
      return NextResponse.json({ msg: "Category not found" }, { status: 404 });
    }

    console.log("Category deleted successfully:", deletedCategory);
    return NextResponse.json({ msg: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ msg: "Error deleting category", error: error.message }, { status: 500 });
  }
};
