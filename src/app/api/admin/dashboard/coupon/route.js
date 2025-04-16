import connectDB from "@/lib/dbConnect";
import { Coupon } from "@/models/couponModels";
import { NextResponse } from "next/server";


// GET method to retrieve all coupons
export async function GET(req) {
  try {
    console.log("Connecting to the database for GET request...");
    await connectDB();
    console.log("Connected to the database.");

    // Parse URL search parameters for filtering options
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const productId = url.searchParams.get("productId");
    const categoryId = url.searchParams.get("categoryId");

    // Build query object based on provided filters
    const query = {};
    if (status) {
      query.status = status;
    }
    if (productId) {
      query.applicableProducts = productId;
    }
    if (categoryId) {
      query.applicableCategories = categoryId;
    }

    // Fetch coupons based on query
    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    console.log(`Found ${coupons.length} coupons`);

    return NextResponse.json({ coupons }, { status: 200 });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching coupons." },
      { status: 500 }
    );
  }
}

// POST method to create a new coupon
export async function POST(req) {
  try {
    console.log("Connecting to the database for POST request...");
    await connectDB();
    console.log("Connected to the database.");

    // Parse incoming request data
    const {
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      usageLimit,
      status, // Changed from isActive to match frontend
      applicableProducts,
      applicableCategories,
    } = await req.json();

    // Validate the request data
    if (
      !code ||
      !discountType ||
      !discountValue ||
      !validFrom ||
      !validUntil
    ) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return NextResponse.json(
        { error: "Coupon code already exists." },
        { status: 409 }
      );
    }

    // Create a new coupon document and save it to the database
    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      usageLimit,
      status, // Using status instead of isActive
      applicableProducts,
      applicableCategories,
    });

    await newCoupon.save();
    console.log("Coupon created:", newCoupon);

    return NextResponse.json(
      { message: "Coupon created successfully!", coupon: newCoupon },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the coupon." },
      { status: 500 }
    );
  }
}

// PUT method to update an existing coupon
export async function PUT(req) {
  try {
    console.log("Connecting to the database for PUT request...");
    await connectDB();
    console.log("Connected to the database.");

    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Coupon ID is required." },
        { status: 400 }
      );
    }

    // Check if coupon exists
    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      return NextResponse.json(
        { error: "Coupon not found." },
        { status: 404 }
      );
    }

    // Check if updating code and if it already exists
    if (updateData.code && updateData.code !== existingCoupon.code) {
      const codeExists = await Coupon.findOne({ 
        code: updateData.code,
        _id: { $ne: id }
      });
      
      if (codeExists) {
        return NextResponse.json(
          { error: "Coupon code already exists." },
          { status: 409 }
        );
      }
    }

    // Update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    console.log("Coupon updated:", updatedCoupon);

    return NextResponse.json(
      { message: "Coupon updated successfully!", coupon: updatedCoupon },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the coupon." },
      { status: 500 }
    );
  }
}