// /app/api/shipping/[id]/route.js
import connectDB from "@/lib/dbConnect";
import { ShippingPrice } from "@/models/ShippingPrice";
import { NextResponse } from "next/server";

// GET a single shipping rule
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const shippingRule = await ShippingPrice.findById(id);
    if (!shippingRule) {
      return NextResponse.json({ msg: "Shipping rule not found" }, { status: 404 });
    }
    
    return NextResponse.json(shippingRule, { status: 200 });
  } catch (error) {
    console.error("Error fetching shipping rule:", error);
    return NextResponse.json({ msg: "Failed to fetch shipping rule", error: error.message }, { status: 500 });
  }
}

// UPDATE a shipping rule
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();
    
    // Validate required fields
    if (!data.country || data.priceRange?.min === undefined || data.shippingFee === undefined) {
      return NextResponse.json({ msg: "Country, minimum price range, and shipping fee are required" }, { status: 400 });
    }
    
    // Check for overlapping rules (excluding this rule)
    const existingRule = await ShippingPrice.findOne({
      _id: { $ne: id },
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
    
    const updatedShippingRule = await ShippingPrice.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!updatedShippingRule) {
      return NextResponse.json({ msg: "Shipping rule not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedShippingRule, { status: 200 });
  } catch (error) {
    console.error("Error updating shipping rule:", error);
    return NextResponse.json({ msg: "Failed to update shipping rule", error: error.message }, { status: 500 });
  }
}

// DELETE a shipping rule
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const deletedShippingRule = await ShippingPrice.findByIdAndDelete(id);
    if (!deletedShippingRule) {
      return NextResponse.json({ msg: "Shipping rule not found" }, { status: 404 });
    }
    
    return NextResponse.json({ msg: "Shipping rule deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting shipping rule:", error);
    return NextResponse.json({ msg: "Failed to delete shipping rule", error: error.message }, { status: 500 });
  }
}