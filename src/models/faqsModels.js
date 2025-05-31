import mongoose from "mongoose";

const faqsSchema = new mongoose.Schema({
  faq: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      
    }
  ],
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
}, {
  timestamps: true,
});

export const Faqs = mongoose.models.Faqs || mongoose.model("Faqs", faqsSchema);
