// app/api/login/route.ts
import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// POST handler
export const POST = async (req) => {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ msg: "Email and OTP are required" }, { status: 400 });
    }

    const user = await userModels.findOne({ email });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const { isLoginOTP, isLoginOTPExpires, status, role, _id } = user;

    if (isLoginOTP !== otp) {
      return NextResponse.json({ msg: "Invalid OTP" }, { status: 401 });
    }

    if (isLoginOTPExpires < new Date()) {
      return NextResponse.json({ msg: "OTP has expired" }, { status: 401 });
    }

    if (status !== "Active" || role !== "User") {
      return NextResponse.json({ msg: "Not Authorized" }, { status: 403 });
    }

    const token = generateToken({ id: _id, email: user.email });

    const response = NextResponse.json(
      { msg: "Login successful", userId: _id },
      { status: 200 }
    );

    response.cookies.set("userAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Clear OTP fields after successful login
    user.isLoginOTP = null;
    user.isLoginOTPExpires = null;
    await user.save();

    return response;
  } catch (error) {
    return NextResponse.json(
      { msg: "Error during login", error: error.message },
      { status: 500 }
    );
  }
};

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1w" });
}
