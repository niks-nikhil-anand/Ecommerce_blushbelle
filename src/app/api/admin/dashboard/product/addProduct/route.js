import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import productModels from "@/models/productModels";
import { NextResponse } from "next/server";


export const POST = async (req) => {
  try {
    await connectDB();

    const formData = await req.formData();

    const getTrimmedValue = (key) => {
      const value = formData.get(key);
      return value ? value.trim() : "";
    };

    const name = getTrimmedValue("name");
    const stock = parseInt(getTrimmedValue("stock"), 10) || 0;
    const originalPrice = parseFloat(getTrimmedValue("originalPrice")) || 0;
    const salePrice = parseFloat(getTrimmedValue("salePrice")) || 0;
    const category = getTrimmedValue("category");
    const collection = getTrimmedValue("collections");
    const tags = getTrimmedValue("tags");
    const description = getTrimmedValue("description");
    const additionalInfo = getTrimmedValue("additionalInfo");
    const isOnSale = formData.get("isOnSale") === "true";
    const isFeaturedSale = formData.get("isFeaturedSale") === "true";

    if (!name || !category || !originalPrice || !salePrice) {
      return NextResponse.json({ msg: "Please provide all required fields." }, { status: 400 });
    }



    const images = formData.getAll("images");
    const featuredImage = formData.get("featuredImage");
    const descriptionImage = formData.get("descriptionImage");

    const imageUploads = await Promise.all(
      images.map(async (image) => {
        const result = await uploadImage(image, "productImages");
        if (!result.secure_url) throw new Error("Image upload failed.");
        return result.secure_url;
      })
    );

    let featuredImageUrl = null;
    if (featuredImage) {
      const featuredImageResult = await uploadImage(featuredImage, "featuredImage");
      if (!featuredImageResult.secure_url) {
        return NextResponse.json({ msg: "Featured image upload failed." }, { status: 500 });
      }
      featuredImageUrl = featuredImageResult.secure_url;
    }

    let descriptionImageUrl = null;
    if (descriptionImage) {
      const descriptionImageResult = await uploadImage(descriptionImage, "descriptionImage");
      if (!descriptionImageResult.secure_url) {
        return NextResponse.json({ msg: "Description image upload failed." }, { status: 500 });
      }
      descriptionImageUrl = descriptionImageResult.secure_url;
    }


    // Generate a unique 6-digit SKU
    let sku = generateSKU();
    while (!(await checkUniqueSKU(sku))) {
      sku = generateSKU();  // Regenerate if the SKU is not unique
    }

    const productData = {
      name,
      sku,
      stock,
      description,
      additionalInfo,
      salePrice,
      originalPrice,
      category,
      subCatgeory:collection,
      isOnSale,
      isFeaturedSale,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      images: imageUploads,
      featuredImage: featuredImageUrl,
      descriptionImage: descriptionImageUrl,
      status: stock > 0 ? "Active" : "Out of stock",
    };

    console.log("Adding product:", productData);
    await productModels.create(productData);
    return NextResponse.json({ msg: "Product added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ msg: "Error adding product", error: error.message }, { status: 500 });
  }
};


export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const products = await productModels.find().populate("category"); // Populate category field

    console.log("Fetched products with categories:", products);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { msg: "Error fetching products", error: error.message },
      { status: 500 }
    );
  }
};



// Function to generate a random 6-digit SKU
const generateSKU = () => {
  const sku = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit number
  return sku.toString();  // Return as a string to ensure consistency
};

// Function to check if the SKU is unique
const checkUniqueSKU = async (sku) => {
  const existingProduct = await productModels.findOne({ sku });
  return existingProduct ? false : true; // Return false if SKU exists
};
