// app/api/coupon/validate/route.js
import connectDB from "@/lib/dbConnect";
import { Coupon } from "@/models/couponModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { code, cartTotal, productIds = [], categoryIds = [] } = body;

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // Check if coupon is active
    if (coupon.status !== 'Active') {
      return NextResponse.json({ error: 'This coupon is not active' }, { status: 400 });
    }

    // Check date validity
    const currentDate = new Date();
    if (currentDate < coupon.validFrom || currentDate > coupon.validUntil) {
      return NextResponse.json({ error: 'This coupon is not valid at this time' }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    // Check minimum purchase requirement
    if (cartTotal < coupon.minPurchaseAmount) {
      return NextResponse.json({
        error: `Minimum purchase of ₹${coupon.minPurchaseAmount} required for this coupon`
      }, { status: 400 });
    }

    // Check for product/category restrictions
    const hasProductRestrictions = coupon.applicableProducts && coupon.applicableProducts.length > 0;
    const hasCategoryRestrictions = coupon.applicableCategories && coupon.applicableCategories.length > 0;
    
    if (hasProductRestrictions) {
      const validProducts = productIds.filter(id => 
        coupon.applicableProducts.some(prodId => prodId.toString() === id.toString())
      );
      
      if (validProducts.length === 0) {
        return NextResponse.json({ 
          error: 'This coupon is not applicable to any products in your cart' 
        }, { status: 400 });
      }
    }
    
    if (hasCategoryRestrictions && categoryIds.length > 0) {
      const validCategories = categoryIds.filter(id => 
        coupon.applicableCategories.some(catId => catId.toString() === id.toString())
      );
      
      if (validCategories.length === 0) {
        return NextResponse.json({ 
          error: 'This coupon is not applicable to any product categories in your cart' 
        }, { status: 400 });
      }
    }

    // Calculate discount
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount !== null && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
      if (discountAmount > cartTotal) {
        discountAmount = cartTotal;
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        minPurchaseAmount: coupon.minPurchaseAmount,
        validUntil: coupon.validUntil,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}