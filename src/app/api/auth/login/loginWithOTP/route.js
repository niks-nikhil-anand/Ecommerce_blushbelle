import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';


export const POST = async (req) => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");
    
    const { email, otp } = await req.json();  // Parse request as JSON
    console.log("Received email:", email);
    console.log("Received OTP:", otp);

    if (!email || !otp) {
      console.error("Email and OTP are required");
      return NextResponse.json({ msg: "Email and OTP are required" }, { status: 400 });
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    console.log("Checking OTP...");
    if (user.isLoginOTP !== otp) {
      console.error("Invalid OTP");
      return NextResponse.json({ msg: "Invalid OTP" }, { status: 401 });
    }

    console.log("Checking OTP expiration...");
    if (user.isLoginOTPExpires < new Date()) {
      console.error("OTP has expired");
      return NextResponse.json({ msg: "OTP has expired" }, { status: 401 });
    }

    console.log("Checking user status...");
    if (user.status !== 'Active') {
      console.log("User status is not Active:", user.status);
      return NextResponse.json({ msg: "Not Authorized" }, { status: 403 });
    }

    console.log("Checking user role...");
    if (user.role !== 'User') {
      console.log("User role is not authorized:", user.role);
      return NextResponse.json({ msg: "Not Authorized" }, { status: 403 });
    }

    // Generate a JWT token
    console.log("Generating token...");
    const token = generateToken({ id: user._id, email: user.email });

    const response = NextResponse.json({ msg: "Login successful" }, { status: 200 });

    // Set the cookie with the token
    console.log("Setting cookie with token...");
    response.cookies.set("userAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    console.log("Response with cookie:", response);
    console.log("Generated token:", token);

    // Clear OTP fields to invalidate OTP after login
    user.isLoginOTP = null;
    user.isLoginOTPExpires = null;
    await user.save();

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ msg: "Error during login", error: error.message }, { status: 500 });
  }
};

function generateToken(user) {
  console.log("Generating token for user:", user);
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1w" });
}
