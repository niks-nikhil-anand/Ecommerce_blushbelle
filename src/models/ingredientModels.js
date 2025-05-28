import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    facts: {
      type: String,
    },
    origin: {
      type: String,
    },
    chemistryName: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientSchema);
