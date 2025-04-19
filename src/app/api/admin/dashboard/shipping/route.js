import connectDB from "@/lib/dbConnect";
import { ShippingPrice } from "@/models/shippingModels";
import { NextResponse } from "next/server";


// GET all shipping rules
export async function GET() {
  try {
    await connectDB();
    const shippingRules = await ShippingPrice.find().sort({ createdAt: -1 });
    return NextResponse.json(shippingRules, { status: 200 });
  } catch (error) {
    console.error("Error fetching shipping rules:", error);
    return NextResponse.json({ msg: "Failed to fetch shipping rules", error: error.message }, { status: 500 });
  }
}

// POST new shipping rule
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Validate required fields
    if (!data.country || data.priceRange?.min === undefined || data.shippingFee === undefined) {
      return NextResponse.json({ msg: "Country, minimum price range, and shipping fee are required" }, { status: 400 });
    }
    
    // Check for overlapping rules
    const existingRule = await ShippingPrice.findOne({
      country: data.country,
      state: data.state || null,
      $or: [
        // Case 1: New range completely contains an existing range
        {
          "priceRange.min": { $gte: data.priceRange.min },
          "priceRange.max": { $lte: data.priceRange.max || Number.MAX_SAFE_INTEGER }
        },
        // Case 2: New range's min is within an existing range
        {
          "priceRange.min": { $lte: data.priceRange.min },
          "priceRange.max": { $gte: data.priceRange.min }
        },
        // Case 3: New range's max is within an existing range
        {
          "priceRange.min": { $lte: data.priceRange.max || Number.MAX_SAFE_INTEGER },
          "priceRange.max": { $gte: data.priceRange.max || Number.MAX_SAFE_INTEGER }
        }
      ]
    });

    if (existingRule) {
      return NextResponse.json({ 
        msg: "A shipping rule with overlapping price range already exists for this location" 
      }, { status: 400 });
    }
    
    const newShippingRule = await ShippingPrice.create(data);
    return NextResponse.json(newShippingRule, { status: 201 });
  } catch (error) {
    console.error("Error creating shipping rule:", error);
    return NextResponse.json({ msg: "Failed to create shipping rule", error: error.message }, { status: 500 });
  }
}