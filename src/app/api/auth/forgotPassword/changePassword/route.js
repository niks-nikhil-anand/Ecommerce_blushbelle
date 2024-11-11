import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import userModels from "@/models/userModels";

export const POST = async (req) => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected.");

    const formData = await req.formData();
    const newPassword = formData.get("newPassword");
    const token = formData.get("token");

    if (!newPassword) {
      console.error("newPassword is required");
      return NextResponse.json({ msg: "newPassword is required" }, { status: 400 });
    }
    if (!token) {
      console.error("token is required");
      return NextResponse.json({ msg: "token is required" }, { status: 400 });
    }

    const User = await userModels.findOne({ resetPasswordToken: token });

    if (!User) {
      console.error("Invalid or expired token");
      return NextResponse.json({ msg: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModels.updateOne(
      { resetPasswordToken: token },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: "",
          resetPasswordExpires: ""
        }
      }
    );
    console.log("Password reset successfully");
    return NextResponse.json({ msg: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ msg: "Error resetting password", error: error.message }, { status: 500 });
  }
};
