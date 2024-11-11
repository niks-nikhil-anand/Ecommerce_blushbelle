import { NextResponse } from 'next/server';
import connectDB from "@/lib/dbConnect";
import NewsLetter from "@/models/newsLetter";

export async function POST(req) {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Parse incoming request data
    const { name, email } = await req.json();

    // Validate the request data
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if the email already exists in the database to avoid duplicate subscriptions
    const existingSubscription = await NewsLetter.findOne({ email });
    if (existingSubscription) {
      return NextResponse.json({ error: 'Email is already subscribed.' }, { status: 409 });
    }

    // Create a new subscription document and save it to the database
    const newSubscription = new NewsLetter({ name, email });
    await newSubscription.save();

    // Return a success response
    return NextResponse.json({ message: 'Subscription successful!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json({ error: 'An error occurred while processing your subscription' }, { status: 500 });
  }
}
