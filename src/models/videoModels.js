import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  video: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
   views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
   isPublishedOnHomepage: {
    type: Boolean,
    default: false,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
},
},{
  timestamps: true
});


export const Video = mongoose.models.Video || mongoose.model("Video" , videoSchema)



