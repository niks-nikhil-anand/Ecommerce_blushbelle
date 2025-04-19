// app/api/coupon/redeem/route.js
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

    // First validate the coupon again to ensure it's still valid
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // Recheck validity before redemption
    if (coupon.status !== 'Active') {
      return NextResponse.json({ error: 'This coupon is not active' }, { status: 400 });
    }

    const currentDate = new Date();
    if (currentDate < coupon.validFrom || currentDate > coupon.validUntil) {
      return NextResponse.json({ error: 'This coupon is not valid at this time' }, { status: 400 });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    if (cartTotal < coupon.minPurchaseAmount) {
      return NextResponse.json({
        error: `Minimum purchase of ₹${coupon.minPurchaseAmount} required for this coupon`
      }, { status: 400 });
    }

    // Check product/category restrictions
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

    // Calculate discount amount again to ensure consistency
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

    // Increment the usedCount
    const updatedCoupon = await Coupon.findOneAndUpdate(
      { code },
      { $inc: { usedCount: 1 } },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Coupon redeemed successfully',
      coupon: {
        code: updatedCoupon.code,
        discountType: updatedCoupon.discountType,
        discountValue: updatedCoupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        usedCount: updatedCoupon.usedCount
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    return NextResponse.json({ error: 'Failed to redeem coupon' }, { status: 500 });
  }
}