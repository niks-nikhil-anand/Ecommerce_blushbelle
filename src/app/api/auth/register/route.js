import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/welcomeEmail";
import userModels from "@/models/userModels";
import connectDB from "@/lib/dbConnect";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    const formData = await req.formData();
    console.log("Form data received:", formData);

    const fullName = formData.get("fullName");
    const email = formData.get("email");
    let mobileNumber = formData.get("mobileNumber");
    const password = formData.get("password");

    console.log("Received values:", { fullName, email, mobileNumber, password });

    if (!fullName || !email || !mobileNumber || !password) {
      console.log("Validation failed: Missing required fields.");
      return NextResponse.json({ msg: "Please provide all the required fields." }, { status: 400 });
    }

    // Validate the mobile number to ensure it is a 10-digit number
    const mobileNumberPattern = /^\d{10}$/;
    if (!mobileNumberPattern.test(mobileNumber)) {
      console.log("Validation failed: Invalid mobile number.");
      return NextResponse.json({ msg: "Please provide a valid 10-digit mobile number." }, { status: 400 });
    }

    // Add country code +91
    mobileNumber = `+91${mobileNumber}`;
    console.log("Formatted mobile number:", mobileNumber);

    // Check if the email or mobile number already exists
    const existingUser = await userModels.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      console.log("Validation failed: User already exists with the provided email or mobile number.");
      return NextResponse.json({ msg: "User with this email or mobile number already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    const userData = {
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
    };

    const user = new userModels(userData);
    await user.save();
    console.log("User saved to the database:", user);
    


    await resend.emails.send({
      from: 'no-reply@cleanveda.com',
      to: email,
      subject: 'Welcome to Cleanveda',
      react: <WelcomeEmail fullName={fullName} />,
    });
    console.log("Welcome email sent to:", email);

    return NextResponse.json({ msg: "Account created successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error creating account:", error.message);
    return NextResponse.json({ msg: "Error creating account", error: error.message }, { status: 500 });
  }
};
