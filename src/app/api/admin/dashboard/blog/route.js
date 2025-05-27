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
    const featuredImage = formData.get("featuredImage");
    
    // Handle multiple products - they can be sent as multiple form fields or as a JSON string
    const products = [];
    
    // Method 1: If products are sent as separate form fields (product[0], product[1], etc.)
    let index = 0;
    while (formData.get(`product[${index}]`)) {
      products.push(formData.get(`product[${index}]`));
      index++;
    }
    
    // Method 2: If products are sent as a JSON string
    if (products.length === 0) {
      const productString = formData.get("products");
      if (productString) {
        try {
          const parsedProducts = JSON.parse(productString);
          if (Array.isArray(parsedProducts)) {
            products.push(...parsedProducts);
          }
        } catch (error) {
          console.error("Error parsing products JSON:", error);
        }
      }
    }
    
    // Method 3: If products are sent as comma-separated values in a single field
    if (products.length === 0) {
      const productString = formData.get("product");
      if (productString) {
        const productArray = productString.split(',').map(id => id.trim()).filter(id => id);
        products.push(...productArray);
      }
    }

    console.log("Parsed form data:", { title, content, products });

    // Validate required fields
    if (!title || !content) {
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

    // Prepare blog data with the products array
    const blogData = {
      title,
      content,
      product: products, // Array of product IDs
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

    // Fetch all blogs and populate the 'product' field (which is now an array)
    const blogs = await Blog.find().populate("product");
    console.log("Fetched blogs:", blogs);

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ msg: "Error fetching blogs", error: error.message }, { status: 500 });
  }
};