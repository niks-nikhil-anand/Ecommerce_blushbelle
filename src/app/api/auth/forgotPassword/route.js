import ForgotPasswordEmail from "@/emails/forgotPasswordEmail";
import connectDB from "@/lib/dbConnect";
import { generateRandomToken, generateResetLink } from "@/lib/forgotPasswordToken";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Database connected.");

    const formData = await req.formData();
    const email = formData.get("email");
    console.log("Received email:", email);

    // Validate email input
    if (!email) {
      console.error("Email is required");
      return NextResponse.json({ msg: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await userModels.findOne({ email });
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    // Generate a random token and set expiration
    const token = generateRandomToken();
    const expiration = new Date(Date.now() + 3600000); 

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    const resetLink = generateResetLink(token);
    console.log("Generated reset link:", resetLink);

    // Send the password reset email
    console.log("Sending password reset email to:", email);
    await resend.emails.send({
      from: "no-reply@cleanveda.com",
      to: email,
      subject: "Password Reset Request",
      react: ForgotPasswordEmail({ name: user.fullName, resetLink }),
    });

    console.log("Password reset email sent.");
    return NextResponse.json({ msg: "Password reset email sent" }, { status: 200 });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return NextResponse.json({ msg: "Error requesting password reset", error: error.message }, { status: 500 });
  }
};
