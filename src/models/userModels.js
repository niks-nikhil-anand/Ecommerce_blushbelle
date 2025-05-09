import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please provide a valid email address'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^\+?[1-9]\d{9,14}$/, 'Please provide a valid mobile number'],
        unique: true,
        trim: true,

    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    resetPasswordToken:{
        type:String
     },
    resetPasswordExpires:{
        type : Date
    },
    isLoginOTP:{
        type:String
      },
    isLoginOTPExpires:{
        type : Date
    },
    profilePic: {
        type: String,
        default: ''
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    }],
    role: {
        type: String,
        enum: ['User', 'Admin', 'SuperAdmin', 'Moderator', 'Editor', 'Viewer'],
        default: 'User'
    },    
    status: {
        type: String,
        enum: ['Blocked', 'Pending', 'inReview', 'Active'],
        default: 'Active'
    },
    isToken: {
        type: String,
        default: ''
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist',
    }]
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);
