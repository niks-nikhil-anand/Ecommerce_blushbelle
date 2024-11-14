import connectDB from "@/lib/dbConnect";
import { Blog } from "@/models/blogModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { productId } = params; // Correctly destructure 'productId'
  console.log('Request Params:', params); // Log all request params
  console.log('Review Id:', productId); // Log the ID parameter

  try {
    console.log('Attempting to connect to the database...');
    await connectDB();
    console.log('Database connection successful');

    const blog = await Blog.find({ product: productId }); 

    if (!blog) {
      console.log('Blog not found');
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }

    console.log('Returning blog data successfully');
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ msg: "Error fetching blog", error: error.message }, {
      status: 500
    });
  }
};
