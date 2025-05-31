import connectDB from "@/lib/dbConnect";
import { Blog } from "@/models/blogModels";
import { NextResponse } from "next/server";


export const GET = async (request, { params }) => {
  const { id } = params; // Correct destructuring

  try {
    await connectDB();

    const blogs = await Blog.find({ product: id }); // Fetch blogs related to productId
    console.log("📝 Blogs fetched from database:");

    if (!blogs || blogs.length === 0) {
      return NextResponse.json({ msg: "No blogs found for this product" }, { status: 404 });
    }
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json(
      { msg: "Error fetching blogs", error: error.message },
      { status: 500 }
    );
  }
};
