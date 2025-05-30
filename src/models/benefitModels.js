import mongoose from "mongoose";

const benefitSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  items: [
    {
      icon: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    }
  ],
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
}, {
  timestamps: true,
});

export const Benefit = mongoose.models.Benefit || mongoose.model("Benefit", benefitSchema);
