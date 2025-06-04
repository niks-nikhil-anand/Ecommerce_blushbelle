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
      unique: true,
    },
    stock: {
      type: Number,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    purpose: {
      type: String,
      required: true,
    },
    suggestedUse: {
      type: String,
      required: true,
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
    subCategory: {
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
      required: [true, "Description image URL is required"],
    },
    images: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isShowOnHomePage: {
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

// Auto-increment SKU based on max value in collection
productSchema.pre("save", async function (next) {
  if (!this.isNew || this.sku) return next();

  try {
    const lastProduct = await mongoose.models.Product
      .findOne({})
      .sort({ sku: -1 })
      .collation({ locale: "en_US", numericOrdering: true });

    const lastSku = lastProduct?.sku ? parseInt(lastProduct.sku) : 1000;
    this.sku = (lastSku + 1).toString();
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
