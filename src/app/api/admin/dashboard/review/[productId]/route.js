import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import reviewModels from "@/models/reviewModels";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => { 
    const { productId } = params; 
    console.log('Request Params in review :', params); 
    console.log('Product ID:', productId); 
    try {
      console.log("Attempting to connect to the database...");
      await connectDB();
      console.log("Successfully connected to the database.");

      console.log("Fetching reviews for product ID:", productId);
      const reviews = await reviewModels.find({ product: productId });
      
      console.log("Fetched reviews:", reviews);
      return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json({ msg: "Error fetching reviews", error: error.message }, { status: 500 });
    }
};


export const POST = async (req, { params }) => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");

    // Extract productId from params
    const { productId } = params;
    if (!productId) {
      console.log("Validation failed: Missing product ID in route parameters.");
      return NextResponse.json(
        { msg: "Product ID is required." },
        { status: 400 }
      );
    }
    console.log("Product ID:", productId);

    // Parse form data
    const formData = await req.json();
    console.log("Received form data:", formData);

    const { name, email, rating, reviewTitle, review } = formData;

    // Validate required fields
    if (!name || !email || !rating || !reviewTitle || !review) {
      console.log("Validation failed: Missing required fields.");
      return NextResponse.json(
        { msg: "Please provide all the required fields." },
        { status: 400 }
      );
    }

    // Validate rating (if applicable)
    if (rating < 1 || rating > 5) {
      console.log("Validation failed: Rating out of range.");
      return NextResponse.json(
        { msg: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    // Check if the product exists
    console.log("Checking if product exists with ID:", productId);
    const existingProduct = await productModels.findById(productId);
    if (!existingProduct) {
      console.log("Product not found.");
      return NextResponse.json(
        { msg: "Product not found." },
        { status: 404 }
      );
    }
    console.log("Product found:", existingProduct);

    // Prepare the review data
    const reviewData = {
      name,
      email,
      rating,
      reviewTitle,
      review,
      product: productId, // Link review to the product
    };
    console.log("Creating review with data:", reviewData);

    // Create the review
    await reviewModels.create(reviewData);

    console.log("Review added successfully.");
    return NextResponse.json(
      { msg: "Review added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding review:", error.message);
    return NextResponse.json(
      { msg: "Error adding review", error: error.message },
      { status: 500 }
    );
  }
};
