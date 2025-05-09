import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true, // Ensure coupon codes are unique
  },
  discountType: {
    type: String,
    required: true,
    enum: ["percentage", "fixed"], 
  },
  discountValue: {
    type: Number,
    required: true, // The value of the discount (e.g., 10 for 10% or $10)
  },
  minPurchaseAmount: {
    type: Number,
    default: 0, // Minimum purchase amount required to apply the coupon
  },
  maxDiscountAmount: {
    type: Number,
    default: null, // Maximum discount amount (optional, for percentage discounts)
  },
  validFrom: {
    type: Date,
    required: true, // Start date of coupon validity
  },
  validUntil: {
    type: Date,
    required: true, // End date of coupon validity
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0, 
  },
  status: {
    type: String,
    enum: ['Active', 'UnActive'],
    default: 'Active',
},
  applicableProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
    },
  ],
  applicableCategories: [
   {
     type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
   }
  ],
},{
  timestamps: true
});

export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);