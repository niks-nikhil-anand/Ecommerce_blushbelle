import connectDB from "@/lib/dbConnect";
import deleteImage from "@/lib/deleteImages";
import categoryModels from "@/models/categoryModels";
import { NextResponse } from "next/server";

export const DELETE = async (req, { params }) => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");

    const categoryId = params.id;
    console.log("Received category ID:", categoryId);

    if (!categoryId) {
      console.error("Category ID is missing.");
      return NextResponse.json({ msg: "Category ID is required" }, { status: 400 });
    }

    console.log("Attempting to delete category with ID:", categoryId);
    const deletedCategory = await categoryModels.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      console.warn("No category found to delete with ID:", categoryId);
      return NextResponse.json({ msg: "Category not found" }, { status: 404 });
    }

    console.log("Deleted category:", deletedCategory);

    if (deletedCategory.image) {
      console.log("Found associated image. Attempting to delete from Cloudinary:", deletedCategory.image);
      try {
        await deleteImage(deletedCategory.image);
        console.log("Image deleted from Cloudinary successfully.");
      } catch (cloudErr) {
        console.error("Failed to delete image from Cloudinary:", cloudErr.message);
      }
    } else {
      console.log("No image found for this category.");
    }

    return NextResponse.json({ msg: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during category deletion:", error);
    return NextResponse.json({ msg: "Error deleting category", error: error.message }, { status: 500 });
  }
};
