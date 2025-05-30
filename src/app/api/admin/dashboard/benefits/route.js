import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import { Benefit } from "@/models/benefitModel"; // Updated import
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDB();

    const formData = await req.formData();

    // Get the benefit data from form
    const image = formData.get("image");
    const itemsString = formData.get("items");
    const product = formData.get("product");

    // Validate required fields
    if (!image) {
      return NextResponse.json({ 
        msg: "Please provide a featured image." 
      }, { status: 400 });
    }

    if (!itemsString) {
      return NextResponse.json({ 
        msg: "Please provide benefit items." 
      }, { status: 400 });
    }

    // Parse benefit items from JSON string
    let items = [];
    try {
      items = JSON.parse(itemsString);
      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ 
          msg: "Benefit items must be a non-empty array." 
        }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ 
        msg: "Invalid benefit items format." 
      }, { status: 400 });
    }

    // Validate each benefit item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.title || !item.description) {
        return NextResponse.json({ 
          msg: `Benefit item ${i + 1} must have both title and description.` 
        }, { status: 400 });
      }
      
      // Icon is optional, but if not provided, set empty string
      if (!item.icon) {
        item.icon = "";
      }
    }

    // Upload the benefit image
    const imageUploadResult = await uploadImage(image, "benefitImages");

    if (!imageUploadResult.secure_url) {
      return NextResponse.json({ 
        msg: "Image upload failed." 
      }, { status: 500 });
    }

    const imageUrl = imageUploadResult.secure_url;

    // Prepare benefit data
    const benefitData = {
      image: imageUrl,
      items: items,
    };

    // Add product association if provided
    if (product && product.trim() !== "") {
      benefitData.product = product;
    }

    // Validate that product is provided (since it's required in schema)
    if (!benefitData.product) {
      return NextResponse.json({ 
        msg: "Product association is required." 
      }, { status: 400 });
    }

    // Save the benefit data to the database
    const newBenefit = await Benefit.create(benefitData);
    
    return NextResponse.json({ 
      msg: "Benefit added successfully",
      data: newBenefit
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error adding benefit:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ 
        msg: "Validation error", 
        errors: validationErrors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      msg: "Error adding benefit", 
      error: error.message 
    }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connectDB();

    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product');

    let query = {};
    
    // Filter by product if provided
    if (productId) {
      query.product = productId;
    }

    // Fetch benefits and populate the 'product' field
    const benefits = await Benefit.find(query)
      .populate("product", "name category subCategory") // Only populate specific fields
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json({
      msg: "Benefits fetched successfully",
      data: benefits,
      count: benefits.length
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching benefits:", error);
    return NextResponse.json({ 
      msg: "Error fetching benefits", 
      error: error.message 
    }, { status: 500 });
  }
};
