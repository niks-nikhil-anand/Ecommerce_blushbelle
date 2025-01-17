import { NextResponse } from 'next/server';
import connectDB from "@/lib/dbConnect";
import { Resend } from "resend";
import NewsLetterEmail from '@/emails/newsLetterEmail';
import NewsLetter from '@/models/newsLetter';

const resend = new Resend(process.env.RESEND_API_KEY);



export async function POST(req) {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Parse incoming request data
    const { email } = await req.json();

    // Validate the request data
    if ( !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if the email already exists in the database to avoid duplicate subscriptions
    const existingSubscription = await NewsLetter.findOne({ email });
    if (existingSubscription) {
      return NextResponse.json({ error: 'Email is already subscribed.' }, { status: 409 });
    }

    // Create a new subscription document and save it to the database
    const newSubscription = new NewsLetter({ email });
    await newSubscription.save();


    await resend.emails.send({
      from: 'no-reply@cleanveda.com',
      to: email,
      subject: 'Welcome to Cleanveda - Enjoy 15% Off Your First Order!',
      react: (
        <NewsLetterEmail />
      ),
    });
    console.log("Welcome email sent to:", email);

    return NextResponse.json({ message: 'Subscription successful!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json({ error: 'An error occurred while processing your subscription' }, { status: 500 });
  }
}
