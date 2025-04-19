// app/api/coupon/validate/route.js
import connectDB from "@/lib/dbConnect";
import { Coupon } from "@/models/couponModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("🔄 Starting coupon validation process...");
    await connectDB();
    console.log("✅ Database connected");

    const body = await req.json();
    console.log("📦 Request body:", JSON.stringify(body, null, 2));
    
    const { code, cartTotal, productIds = [], categoryIds = [] } = body;
    console.log(`🔍 Validating coupon code: ${code}`);
    console.log(`💰 Cart total: ${cartTotal}`);
    console.log(`🏷️ Products IDs: ${JSON.stringify(productIds)}`);
    console.log(`📂 Category IDs: ${JSON.stringify(categoryIds)}`);

    if (!code) {
      console.log("❌ Error: No coupon code provided");
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }
    
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      console.log(`❌ Error: Coupon with code '${code}' not found in database`);
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }
    
    console.log("🎫 Found coupon:", JSON.stringify({
      code: coupon.code,
      status: coupon.status,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      minPurchaseAmount: coupon.minPurchaseAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
    }, null, 2));

    // Check if coupon is active
    if (coupon.status !== 'Active') {
      console.log(`❌ Error: Coupon status is ${coupon.status}, not Active`);
      return NextResponse.json({ error: 'This coupon is not active' }, { status: 400 });
    }
    console.log("✅ Coupon status check passed");

    // Check date validity
    const currentDate = new Date();
    console.log(`📅 Current date: ${currentDate.toISOString()}`);
    console.log(`📅 Valid from: ${coupon.validFrom.toISOString()}`);
    console.log(`📅 Valid until: ${coupon.validUntil.toISOString()}`);
    
    if (currentDate < coupon.validFrom) {
      console.log("❌ Error: Coupon validity period has not started yet");
      return NextResponse.json({ error: 'This coupon is not valid at this time' }, { status: 400 });
    }
    
    if (currentDate > coupon.validUntil) {
      console.log("❌ Error: Coupon has expired");
      return NextResponse.json({ error: 'This coupon is not valid at this time' }, { status: 400 });
    }
    console.log("✅ Date validity check passed");

    // Check usage limit
    if (coupon.usageLimit !== null) {
      console.log(`🔢 Usage limit: ${coupon.usageLimit}, Current usage: ${coupon.usedCount}`);
      if (coupon.usedCount >= coupon.usageLimit) {
        console.log("❌ Error: Coupon usage limit reached");
        return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
      }
    }
    console.log("✅ Usage limit check passed");

    // Check minimum purchase requirement
    console.log(`💲 Minimum purchase required: ${coupon.minPurchaseAmount}, Cart total: ${cartTotal}`);
    if (cartTotal < coupon.minPurchaseAmount) {
      console.log("❌ Error: Cart total is less than minimum purchase amount");
      return NextResponse.json({
        error: `Minimum purchase of ₹${coupon.minPurchaseAmount} required for this coupon`
      }, { status: 400 });
    }
    console.log("✅ Minimum purchase check passed");

    // Check for product restrictions
    const hasProductRestrictions = coupon.applicableProducts && coupon.applicableProducts.length > 0;
    if (hasProductRestrictions) {
      console.log("🔍 Checking product restrictions...");
      console.log(`📋 Applicable products: ${JSON.stringify(coupon.applicableProducts.map(id => id.toString()))}`);
      console.log(`📋 Cart products: ${JSON.stringify(productIds)}`);
      
      const validProducts = productIds.filter(id => 
        coupon.applicableProducts.some(prodId => prodId.toString() === id.toString())
      );
      
      console.log(`✓ Valid products in cart: ${JSON.stringify(validProducts)}`);
      
      if (validProducts.length === 0) {
        console.log("❌ Error: No applicable products found in cart");
        return NextResponse.json({ 
          error: 'This coupon is not applicable to any products in your cart' 
        }, { status: 400 });
      }
    } else {
      console.log("ℹ️ No product restrictions for this coupon");
    }
    console.log("✅ Product restriction check passed");
    
    // Check for category restrictions
    const hasCategoryRestrictions = coupon.applicableCategories && coupon.applicableCategories.length > 0;
    if (hasCategoryRestrictions && categoryIds.length > 0) {
      console.log("🔍 Checking category restrictions...");
      console.log(`📋 Applicable categories: ${JSON.stringify(coupon.applicableCategories.map(id => id.toString()))}`);
      console.log(`📋 Cart categories: ${JSON.stringify(categoryIds)}`);
      
      const validCategories = categoryIds.filter(id => 
        coupon.applicableCategories.some(catId => catId.toString() === id.toString())
      );
      
      console.log(`✓ Valid categories in cart: ${JSON.stringify(validCategories)}`);
      
      if (validCategories.length === 0) {
        console.log("❌ Error: No applicable categories found in cart");
        return NextResponse.json({ 
          error: 'This coupon is not applicable to any product categories in your cart' 
        }, { status: 400 });
      }
    } else {
      console.log("ℹ️ No category restrictions for this coupon or no category IDs provided");
    }
    console.log("✅ Category restriction check passed");

    // Calculate discount
    console.log(`💱 Calculating discount of type: ${coupon.discountType}`);
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      console.log(`📊 Initial percentage discount: ${discountAmount} (${coupon.discountValue}% of ${cartTotal})`);
      
      if (coupon.maxDiscountAmount !== null && discountAmount > coupon.maxDiscountAmount) {
        console.log(`📊 Discount exceeds maximum, capping at: ${coupon.maxDiscountAmount}`);
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
      console.log(`📊 Fixed discount amount: ${discountAmount}`);
      
      if (discountAmount > cartTotal) {
        console.log(`📊 Discount exceeds cart total, capping at: ${cartTotal}`);
        discountAmount = cartTotal;
      }
    }
    
    console.log(`💰 Final discount amount: ${parseFloat(discountAmount.toFixed(2))}`);

    const response = {
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        minPurchaseAmount: coupon.minPurchaseAmount,
        validUntil: coupon.validUntil,
      }
    };
    
    console.log("✅ Coupon validation successful!");
    console.log("📤 Response payload:", JSON.stringify(response, null, 2));

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("🔴 ERROR in coupon validation:", error);
    console.error("🔴 Error stack:", error.stack);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}