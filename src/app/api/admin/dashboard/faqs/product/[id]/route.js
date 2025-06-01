import connectDB from "@/lib/dbConnect";
import { Faqs } from "@/models/faqsModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  console.log("🚀 Request received to fetch FAQs for product");

  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    const faqs = await Faqs.find({ product: id });
    console.log("📦 FAQs fetched from database:");

    if (!faqs || faqs.length === 0) {
      console.log("⚠️ No FAQs found for the given productId");
      return NextResponse.json({ msg: "No FAQs found for this product" }, { status: 404 });
    }

    console.log("🎯 Returning FAQs:");
    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching FAQs:", error);
    return NextResponse.json(
      { msg: "Error fetching FAQs", error: error.message },
      { status: 500 }
    );
  }
};
