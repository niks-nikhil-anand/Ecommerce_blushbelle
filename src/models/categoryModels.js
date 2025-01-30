const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for Terms and Conditions
const categorySchema = new Schema({
name: {
    type: String,
    required: true,
  } ,
image :{
    type: String,
    required: true,
},
} , 
{
    timestamps: true
});

export default mongoose.models.Category || mongoose.model('Category' , categorySchema)
