import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import { Blog } from "@/models/blogModels";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const formData = await req.formData();
    console.log("Form data received.");

    const title = formData.get("title");
    const content = formData.get("content");
    const subtitle = formData.get("subtitle");
    const category = formData.get("category");
    const author = formData.get("author");
    const featuredImage = formData.get("featuredImage");
    const product = formData.get("product"); // Adding product field

    console.log("Parsed form data:", { title, content, subtitle, category, author, product });

    // Validate required fields
    if (!title || !content || !subtitle) {
      console.error("Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    // Upload the featured image
    const featuredImageResult = await uploadImage(featuredImage, "blogImages");
    console.log("Image upload result:", featuredImageResult);

    if (!featuredImageResult.secure_url) {
      console.error("Image upload failed.");
      return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
    }

    
    const imageUrl = featuredImageResult.secure_url;
    console.log("Image URL:", imageUrl);

    // Prepare blog data with the product field
    const blogData = {
      title,
      content,
      subtitle,
      category,
      author,
      product, // Add product to blog data
      featuredImage: imageUrl,
    };

    console.log("Blog data to be saved:", blogData);

    // Save the blog data to the database
    await Blog.create(blogData);
    console.log("Blog added successfully.");
    return NextResponse.json({ msg: "Blog added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding blog:", error);
    return NextResponse.json({ msg: "Error adding blog", error: error.message }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Fetch all blogs and populate the 'product' field
    const blogs = await Blog.find().populate("product");
    console.log("Fetched blogs:", blogs);

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ msg: "Error fetching blogs", error: error.message }, { status: 500 });
  }
};

