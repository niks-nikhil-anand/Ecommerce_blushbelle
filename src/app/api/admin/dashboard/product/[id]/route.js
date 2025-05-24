import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;

  console.log("GET /api/products/[id] called");
  console.log("Received params:", params);
  console.log("Extracted ID:", id);

  if (!id) {
    console.warn("ID parameter missing in GET request");
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();
    console.log("Database connected");

    const product = await productModels.findById(id).populate('category').populate('subCatgeory');
    console.log("Fetched Product:", product);

    if (!product) {
      console.warn("Product not found with ID:", id);
      return NextResponse.json({ msg: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ msg: "Error fetching product", error: error.message }, { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  const { id } = params;

  console.log("DELETE /api/products/[id] called");
  console.log('Request Params:', params);
  console.log('Extracted ID:', id);

  if (!id) {
    console.warn("ID parameter missing in DELETE request");
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();
    console.log("Database connected");

    const product = await productModels.findByIdAndDelete(id);
    console.log("Deleted Product:", product);

    if (!product) {
      console.warn("Product not found or already deleted with ID:", id);
      return NextResponse.json({ msg: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ msg: "Error deleting product", error: error.message }, { status: 500 });
  }
};
