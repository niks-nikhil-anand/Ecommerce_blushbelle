import connectDB from "@/lib/dbConnect";
import { Coupon } from "@/models/couponCodeModels";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    console.log("Connecting to the database...");
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
      isActive,
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
      isActive,
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