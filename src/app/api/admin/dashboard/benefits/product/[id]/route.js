import connectDB from "@/lib/dbConnect";
import { Benefit } from "@/models/benefitModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  console.log("🚀 Request received to fetch benefits for product");

  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    const benefits = await Benefit.find({ product: id });
    console.log("📦 Benefits fetched from database:");

    if (!benefits || benefits.length === 0) {
      console.log("⚠️ No benefits found for the given productId");
      return NextResponse.json({ msg: "No benefits found for this product" }, { status: 404 });
    }

    console.log("🎯 Returning benefits:", benefits);
    return NextResponse.json(benefits, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching benefits:", error);
    return NextResponse.json(
      { msg: "Error fetching benefits", error: error.message },
      { status: 500 }
    );
  }
};
