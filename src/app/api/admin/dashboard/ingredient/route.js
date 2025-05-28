import connectDB from "@/lib/dbConnect";
import uploadImage from "@/lib/uploadImages";
import ingredientModels from "@/models/ingredientModels";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const benefits = formData.get("benefits");
    const facts = formData.get("facts");
    const origin = formData.get("origin");
    const chemistryName = formData.get("chemistryName");
    const image = formData.get("image");
    
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

    // Validate required fields
    if (!name || !benefits || !image) {
      return NextResponse.json({ 
        msg: "Please provide all the required fields (name, benefits, and image)." 
      }, { status: 400 });
    }

    // Upload the ingredient image
    const imageUploadResult = await uploadImage(image, "ingredientImages");

    if (!imageUploadResult.secure_url) {
      return NextResponse.json({ msg: "Image upload failed." }, { status: 500 });
    }

    const imageUrl = imageUploadResult.secure_url;

    // Prepare ingredient data with the products array
    const ingredientData = {
      name,
      benefits,
      facts: facts || "", // Optional field
      origin: origin || "", // Optional field
      chemistryName: chemistryName || "", // Optional field
      product: products, // Array of product IDs
      image: imageUrl,
    };

    // Save the ingredient data to the database
    const newIngredient = await ingredientModels.create(ingredientData);
    
    return NextResponse.json({ 
      msg: "Ingredient added successfully",
      data: newIngredient
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error adding ingredient:", error);
    return NextResponse.json({ 
      msg: "Error adding ingredient", 
      error: error.message 
    }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connectDB();

    // Fetch all ingredients and populate the 'product' field (which is an array)
    const ingredients = await ingredientModels.find().populate("product");

    return NextResponse.json(ingredients, { status: 200 });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json({ 
      msg: "Error fetching ingredients", 
      error: error.message 
    }, { status: 500 });
  }
};