import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import categoryModels from "@/models/categoryModels";
import subCategoryModels from "@/models/subCategoryModels";
import { NextResponse } from "next/server";

// POST request to create new SubCategories
export const POST = async (req) => {
  try {
    await connectDB();
    const formData = await req.formData();
    const category = formData.get("category");

    if (!category) {
      return NextResponse.json({ msg: "Please provide a category." }, { status: 400 });
    }

    const subCategoriesData = [];
    const names = formData.getAll("name");
    const images = formData.getAll("image");

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const image = images[i];

      if (!name || !image) {
        return NextResponse.json({ msg: "Please provide all required fields for subcategories." }, { status: 400 });
      }

      const imageResult = await uploadImage(image, "subcategoryImages");

      if (!imageResult.secure_url) {
        return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
      }

      subCategoriesData.push({
        name,
        image: imageResult.secure_url,
        category,
      });
    }

    const createdSubCategories = await subCategoryModels.insertMany(subCategoriesData);
    return NextResponse.json({ msg: "SubCategories added and linked to category successfully", data: createdSubCategories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Error adding subcategories", error: error.message }, { status: 500 });
  }
};

// GET request to fetch all SubCategories with populated category
export const GET = async () => {
  try {
    await connectDB();
    const subCategories = await subCategoryModels.find().populate("category");
    return NextResponse.json({ data: subCategories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Failed to fetch subcategories", error: error.message }, { status: 500 });
  }
};
