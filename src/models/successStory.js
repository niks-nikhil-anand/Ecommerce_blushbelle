const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for SuccessStory
const successStorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.models.SuccessStory || mongoose.model('SuccessStory', successStorySchema);
