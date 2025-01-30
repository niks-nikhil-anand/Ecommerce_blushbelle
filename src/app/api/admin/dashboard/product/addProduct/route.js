import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDB();

    const formData = await req.formData();

    // Helper function to safely get and trim values
    const getTrimmedValue = (key) => {
      const value = formData.get(key);
      return value ? value.trim() : '';
    };

    const name = getTrimmedValue("name");
    const originalPrice = getTrimmedValue("originalPrice");
    const salePrice = getTrimmedValue("salePrice");
    const stock = parseInt(getTrimmedValue("stock"), 10);
    const isOnSale = formData.get("isOnSale") === 'true';
    const isFeaturedSale = formData.get("isFeaturedSale") === 'true';


    const category = getTrimmedValue("category");
    const collections = getTrimmedValue("collections");


    const tags = getTrimmedValue("tags");
    const suggestedUse = getTrimmedValue("suggestedUse");


    const description = getTrimmedValue("description");
    const additionalInfo = getTrimmedValue("additionalInfo");
    
    if (!name || !category) {
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    const images = formData.getAll("images");
    const featuredImage = formData.get("featuredImage");
    const descriptionImage = formData.get("descriptionImage");

    // Log image uploads
    console.log("Uploading images...");
    const imageUploads = await Promise.all(
      images.map(async (image) => {
        const result = await uploadImage(image, "productImages");
        if (!result.secure_url) {
          throw new Error("Image upload failed.");
        }
        return result.secure_url;
      })
    );

    // Upload featured image
    let featuredImageUrl = null;
    if (featuredImage) {
      const featuredImageResult = await uploadImage(featuredImage, "featuredImage");
      if (!featuredImageResult.secure_url) {
        return NextResponse.json({ msg: "Featured image upload failed." }, { status: 500 });
      }
      featuredImageUrl = featuredImageResult.secure_url;
    }

    // Upload description image
    let descriptionImageUrl = null;
    if (descriptionImage) {
      const descriptionImageResult = await uploadImage(descriptionImage, "descriptionImage");
      if (!descriptionImageResult.secure_url) {
        return NextResponse.json({ msg: "Description image upload failed." }, { status: 500 });
      }
      descriptionImageUrl = descriptionImageResult.secure_url;
    }

    const productData = {
      name,
      description,
      salePrice,
      originalPrice,
      category,
      collections,
      suggestedUse,
      servingPerBottle,
      isFanFavourites,
      isOnSale,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      images: imageUploads,
      featuredImage: featuredImageUrl,
      descriptionImage: descriptionImageUrl,
      ingredients,
      productHighlights,
    };

    console.log("Final product data:", productData); 

    await productModels.create(productData);
    return NextResponse.json({ msg: "Product added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding product:", error); // More detailed error logging
    return NextResponse.json({ msg: "Error adding product", error: error.message }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const products = await productModels.find();
    console.log("Fetched products:", products);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ msg: "Error fetching products", error: error.message }, { status: 500 });
  }
};
