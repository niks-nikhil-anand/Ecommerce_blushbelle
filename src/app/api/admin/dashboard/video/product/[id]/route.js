import connectDB from "@/lib/dbConnect";
import { Video } from "@/models/videoModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  console.log("🎬 Request received to fetch videos for product");

  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    const videos = await Video.find({ product: id });
    console.log("📹 Videos fetched from database:", videos);

    if (!videos || videos.length === 0) {
      console.log("⚠️ No videos found for the given productId");
      return NextResponse.json({ msg: "No videos found for this product" }, { status: 404 });
    }

    console.log("🎯 Returning videos:", videos);
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    return NextResponse.json(
      { msg: "Error fetching videos", error: error.message },
      { status: 500 }
    );
  }
};
