import connectDB from "@/lib/dbConnect";
import reviewModels from "@/models/reviewModels";
import productModels from "@/models/productModels"; // Assuming this is where your product schema is defined
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");

    const formData = await req.json(); // Adjusted to parse JSON
    console.log("Received form data:", formData);

    const { name, email, rating, reviewTitle, review, product } = formData;

    // Validate required fields
    if (!name || !email || !rating || !reviewTitle || !review || !product) {
      console.log("Validation failed: Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    // Check if the product exists
    console.log("Checking if product exists with ID:", product);
    const existingProduct = await productModels.findById(product);
    if (!existingProduct) {
      console.log("Product not found.");
      return NextResponse.json({ msg: "Product not found." }, { status: 404 });
    }
    console.log("Product found:", existingProduct);

    // Prepare the review data
    const reviewData = { name, email, rating, reviewTitle, review, product };
    console.log("Creating review with data:", reviewData);
    await reviewModels.create(reviewData);

    console.log("Review added successfully.");
    return NextResponse.json({ msg: "Review added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding review:", error.message);
    return NextResponse.json({ msg: "Error adding review", error: error.message }, { status: 500 });
  }
};
