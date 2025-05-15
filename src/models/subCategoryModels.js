const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for Terms and Conditions
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SubCategory ||
  mongoose.model("SubCategory", subCategorySchema);
