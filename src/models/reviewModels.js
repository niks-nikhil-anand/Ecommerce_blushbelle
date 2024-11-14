const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewTitle: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
