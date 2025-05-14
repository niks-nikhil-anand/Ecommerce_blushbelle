import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "Product sku is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: function () {
        return !this.colors || this.colors.length === 0;
      },
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Product description is required"],
    },
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed,
    },
    salePrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subCatgeory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "SubCategory is required"],
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image URL is required"],
    },
    descriptionImage: {
      type: String,
      required: [true, "Featured image URL is required"],
    },
    images: [
      {
        type: String,
      },
    ],
    isFeaturedSale: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Out of stock"],
      default: "Inactive",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
