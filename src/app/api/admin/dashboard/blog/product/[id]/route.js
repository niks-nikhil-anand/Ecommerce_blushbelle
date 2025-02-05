import connectDB from "@/lib/dbConnect";
import { Blog } from "@/models/blogModels";
import { NextResponse } from "next/server";


export const GET = async (request, { params }) => {
  const { id } = params; // Correct destructuring
  console.log("🚀 Request received to fetch blogs for product");

  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    const blogs = await Blog.find({ product: id }); // Fetch blogs related to productId
    console.log("📝 Blogs fetched from database:", blogs);

    if (!blogs || blogs.length === 0) {
      console.log("⚠️ No blogs found for the given productId");
      return NextResponse.json({ msg: "No blogs found for this product" }, { status: 404 });
    }

    console.log("🎯 Returning blogs:", blogs);
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json(
      { msg: "Error fetching blogs", error: error.message },
      { status: 500 }
    );
  }
};
