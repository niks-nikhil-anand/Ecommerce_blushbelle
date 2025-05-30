import connectDB from "@/lib/dbConnect";
import ingredientModels from "@/models/ingredientModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  console.log("🚀 Request received to fetch ingredients for product");

  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    const ingredients = await ingredientModels.find({ product: id });
    console.log("🧪 Ingredients fetched from database:", ingredients);

    if (!ingredients || ingredients.length === 0) {
      console.log("⚠️ No ingredients found for the given productId");
      return NextResponse.json({ msg: "No ingredients found for this product" }, { status: 404 });
    }

    console.log("🎯 Returning ingredients:", ingredients);
    return NextResponse.json(ingredients, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching ingredients:", error);
    return NextResponse.json(
      { msg: "Error fetching ingredients", error: error.message },
      { status: 500 }
    );
  }
};
