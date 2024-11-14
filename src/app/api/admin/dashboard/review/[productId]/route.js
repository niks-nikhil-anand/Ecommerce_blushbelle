import connectDB from "@/lib/dbConnect";
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
