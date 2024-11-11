import mongoose from 'mongoose';

const NewsLetterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

const NewsLetter = mongoose.models.NewsLetter || mongoose.model('NewsLetter', NewsLetterSchema);

export default NewsLetter;
