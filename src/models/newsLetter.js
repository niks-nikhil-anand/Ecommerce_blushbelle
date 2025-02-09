import mongoose from 'mongoose';

const NewsLetterSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
},{
  timestamps: true
});

const NewsLetter = mongoose.models.NewsLetter || mongoose.model('NewsLetter', NewsLetterSchema);

export default NewsLetter;
