import connectDB from "@/lib/dbConnect";
import contactUsModels from "@/models/contactUsModels";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Parse incoming request data
    const { firstName, lastName, email, mobileNumber, message } = await req.json();

    // Validate the request data
    if (!firstName || !lastName || !email || !mobileNumber || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if the email already exists in the database
    const existingEntry = await contactUsModels.findOne({ email, message });
    if (existingEntry) {
      return NextResponse.json({ error: 'You have already submitted this message.' }, { status: 409 });
    }

    // Get the authenticated user (if applicable)

    // Save contact form data to the database
    const newContactEntry = new contactUsModels({
      firstName,
      lastName,
      email,
      mobileNumber,
      message,
    });
    await newContactEntry.save();

    console.log("Message saved successfully for email:", email);

    return NextResponse.json({ message: 'Your message has been sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    return NextResponse.json({ error: 'An error occurred while submitting your message' }, { status: 500 });
  }
}
