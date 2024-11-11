import mongoose from "mongoose";

const newsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, 
{
  timestamps: true,
});

// Corrected export to match the schema name
export const NewsLetter = mongoose.models.NewsLetter || mongoose.model("NewsLetter", newsLetterSchema);
