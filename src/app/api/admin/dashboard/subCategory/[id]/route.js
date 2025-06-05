import connectDB from "@/lib/dbConnect";
import deleteImage from "@/lib/deleteImages";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const subcategoryId = params.id;

    if (!subcategoryId) {
      console.error("Missing subcategory ID.");
      return NextResponse.json({ msg: "Subcategory ID is required" }, { status: 400 });
    }

    // Find the subcategory by ID and populate the category information
    const subcategory = await subCategoryModels
      .findById(subcategoryId)
      .populate('category')
      .lean();

    if (!subcategory) {
      console.warn("Subcategory not found.");
      return NextResponse.json({ msg: "Subcategory not found" }, { status: 404 });
    }

    console.log("Subcategory found:", subcategory);
    return NextResponse.json(subcategory, { status: 200 });
  } catch (error) {
    console.error("Error finding subcategory:", error);
    return NextResponse.json({ msg: "Error finding subcategory", error: error.message }, { status: 500 });
  }
};

// DELETE /api/admin/dashboard/subcategory/:id
// Delete subcategory by ID
export const DELETE = async (req, { params }) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const subcategoryId = params.id;

    if (!subcategoryId) {
      console.error("Missing subcategory ID.");
      return NextResponse.json({ msg: "Subcategory ID is required" }, { status: 400 });
    }

    const deletedSubcategory = await subCategoryModels.findByIdAndDelete(subcategoryId);

    if (!deletedSubcategory) {
      console.warn("Subcategory not found.");
      return NextResponse.json({ msg: "Subcategory not found" }, { status: 404 });
    }

    if (deletedSubcategory.image) {
      console.log("Found associated image. Attempting to delete from Cloudinary:", deletedCategory.image);
      try {
        await deleteImage(deletedSubcategory.image);
        console.log("Image deleted from Cloudinary successfully.");
      } catch (cloudErr) {
        console.error("Failed to delete image from Cloudinary:", cloudErr.message);
      }
    } else {
      console.log("No image found for this category.");
    }

    console.log("Subcategory deleted successfully:", deletedSubcategory);
    return NextResponse.json({ msg: "Subcategory deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json({ msg: "Error deleting subcategory", error: error.message }, { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const subcategoryId = params.id;
    const updateData = await req.json();

    if (!subcategoryId) {
      console.error("Missing subcategory ID.");
      return NextResponse.json({ msg: "Subcategory ID is required" }, { status: 400 });
    }

    if (Object.keys(updateData).length === 0) {
      console.error("No update data provided.");
      return NextResponse.json({ msg: "No update data provided" }, { status: 400 });
    }

    const updatedSubcategory = await subCategoryModel.findByIdAndUpdate(
      subcategoryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSubcategory) {
      console.warn("Subcategory not found.");
      return NextResponse.json({ msg: "Subcategory not found" }, { status: 404 });
    }

    console.log("Subcategory updated successfully:", updatedSubcategory);
    return NextResponse.json(updatedSubcategory, { status: 200 });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json({ msg: "Error updating subcategory", error: error.message }, { status: 500 });
  }
};