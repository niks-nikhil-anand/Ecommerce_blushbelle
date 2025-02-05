import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();

    // Find the original product first
    const originalProduct = await productModels.findById(id);
    let products;

    if (!originalProduct) {
      // If product not found, return all products except this ID
      products = await productModels.find({ _id: { $ne: id } }).populate('category');
    } else {
      const categoryId = originalProduct.category;

      if (categoryId) {
        // Try to find products in the same category first
        products = await productModels.find({
          _id: { $ne: id },
          category: categoryId
        }).populate('category');

        // If no same-category products found, fallback to all products
        if (products.length === 0) {
          products = await productModels.find({ _id: { $ne: id } }).populate('category');
        }
      } else {
        // If product has no category, return all products except this ID
        products = await productModels.find({ _id: { $ne: id } }).populate('category');
      }
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error.name === 'CastError') {
      return NextResponse.json({ msg: "Invalid product ID format" }, { status: 400 });
    }
    return NextResponse.json({ msg: "Error fetching products", error: error.message }, { status: 500 });
  }
};