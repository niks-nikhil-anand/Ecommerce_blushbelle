import connectDB from "@/lib/dbConnect";
import deleteImage from "@/lib/deleteImages";
import ingredientModels from "@/models/ingredientModels";
import { NextResponse } from "next/server";


export const DELETE = async (request, { params }) => {
    console.log(params)
  const { ingredients } = params;

  console.log("🔴 DELETE request received for ingredient ID:", ingredients);

  try {
    console.log("🟡 Connecting to database...");
    await connectDB();
    console.log("🟢 Connected to database");

    const deletedIngredient = await ingredientModels.findByIdAndDelete(ingredients);
    console.log("🗑️ Deleted ingredient:", deletedIngredient);

    if (!deletedIngredient) {
      console.log("⚠️ Ingredient not found for the provided ID");
      return NextResponse.json({ msg: "Ingredient not found" }, { status: 404 });
    }

    // Delete image if it exists
    if (deletedIngredient.image) {
      console.log("🖼️ Found associated image. Attempting to delete from Cloudinary:", deletedIngredient.image);
      try {
        await deleteImage(deletedIngredient.image);
        console.log("✅ Image deleted from Cloudinary successfully.");
      } catch (cloudErr) {
        console.error("❌ Failed to delete image from Cloudinary:", cloudErr.message);
      }
    } else {
      console.log("ℹ️ No image found for this ingredient.");
    }

    console.log("✅ Ingredient deleted successfully");
    return NextResponse.json({ msg: "Ingredient deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting ingredient:", error);
    return NextResponse.json(
      { msg: "Error deleting ingredient", error: error.message },
      { status: 500 }
    );
  }
};
