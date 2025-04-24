import LoginOtpEmail from "@/emails/loginOTPEmail";
import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req) => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");
    
    const { email } = await req.json();
    console.log("Received email:", email);

    if (!email) {
      console.error("Email is required");
      return NextResponse.json({ msg: "Email is required" }, { status: 400 });
    }

    const User = await userModels.findOne({ email });
    if (!User) {
      console.error("User not found");
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    // Generate a random 6-digit OTP and expiration time
    const LoginOTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const expiration = new Date(Date.now() + 3600000); // OTP expires in 1 hour

    // Save OTP and expiration to the user record
    User.isLoginOTP = LoginOTP;
    User.isLoginOTPExpires = expiration;
    await User.save();

    console.log("Sending OTP email to:", email);
    await resend.emails.send({
      from: "no-reply@cleanveda.com",
      to: email,
      subject: "Your OTP for Login",
      react: LoginOtpEmail({ name: User.fullName, otp: LoginOTP }),
    });

    console.log("OTP email sent.");
    return NextResponse.json({ msg: "OTP email sent" }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ msg: "Error sending OTP", error: error.message }, { status: 500 });
  }
};
