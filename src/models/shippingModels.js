import mongoose from "mongoose";

const shippingPriceSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
    default: null,
  },
  priceRange: {
    min: {
      type: Number,
      required: true,
      default: 0, 
    },
    max: {
      type: Number,
      default: null, 
    }
  },
  shippingFee: {
    type: Number,
    required: true,
    min: 0, 
  },
  isFreeShipping: {
    type: Boolean,
    default: false,
  },
  estimatedDeliveryTime: {
    minDays: {
      type: Number,
      default: 1,
    },
    maxDays: {
      type: Number,
      default: 7,
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});
shippingPriceSchema.index({ country: 1, region: 1, "priceRange.min": 1, "priceRange.max": 1 });

export const ShippingPrice = mongoose.models.ShippingPrice || mongoose.model("ShippingPrice", shippingPriceSchema);