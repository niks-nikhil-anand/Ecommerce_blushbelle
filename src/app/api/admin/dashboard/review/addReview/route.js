import connectDB from "@/lib/dbConnect";
import productModels from "@/models/productModels";
import reviewModels from "@/models/reviewModels";
import { NextResponse } from "next/server";


export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const formData = await req.formData();
    console.log("Form data received.");

    // Extract review details from the form
    const reviewName = formData.get("name");
    const reviewEmail = formData.get("email");
    const rating = parseInt(formData.get("rating"));
    const reviewTitle = formData.get("reviewTitle");
    const reviewContent = formData.get("review");
    const product = formData.get("product");

    console.log("Parsed form data:", { reviewName, reviewEmail, rating, reviewTitle, reviewContent, product });

    // Validate required fields
    if (!reviewName || !reviewEmail || !rating || !reviewTitle || !reviewContent || !product) {
      console.error("Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    // Check if the product exists in the database
    const existingProduct = await productModels.findById(product);
    if (!existingProduct) {
      console.error("Product not found.");
      return NextResponse.json({ msg: "Product not found." }, { status: 404 });
    }

    // Prepare the review data to be saved
    const reviewData = {
      name: reviewName,
      email: reviewEmail,
      rating,
      reviewTitle,
      review: reviewContent,
      product, // The product ID
    };

    console.log("Review data to be saved:", reviewData);

    // Save the review to the database
    await reviewModels.create(reviewData);
    console.log("Review added successfully.");

    return NextResponse.json({ msg: "Review added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ msg: "Error adding review", error: error.message }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Fetch all reviews from the database
    const reviews = await Review.find().populate("product"); // Populate product details if necessary
    
    console.log("Fetched reviews:", reviews);
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ msg: "Error fetching reviews", error: error.message }, { status: 500 });
  }
};
