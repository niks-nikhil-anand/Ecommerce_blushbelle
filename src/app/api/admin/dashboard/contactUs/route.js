import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import ContactUs from '@/models/ContactUs';
import resend from '@/utils/resend';
import ContactUsEmail from '@/emails/ContactUsEmail';

export async function POST(req) {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Connected to the database.");

    // Parse incoming request data
    const { first_name, last_name, email, phone_number, message } = await req.json();

    // Validate the request data
    if (!first_name || !last_name || !email || !phone_number || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if the email already exists in the database (optional, if you want to prevent multiple submissions)
    const existingEntry = await ContactUs.findOne({ email, message });
    if (existingEntry) {
      return NextResponse.json({ error: 'You have already submitted this message.' }, { status: 409 });
    }

    // Save contact form data to the database
    const newContactEntry = new ContactUs({ first_name, last_name, email, phone_number, message });
    await newContactEntry.save();

    // Send confirmation email
    await resend.emails.send({
      from: 'no-reply@cleanveda.com',
      to: email,
      subject: 'Thank You for Contacting Cleanveda!',
      react: (
        <ContactUsEmail firstName={first_name} />
      ),
    });

    console.log("Confirmation email sent to:", email);

    return NextResponse.json({ message: 'Your message has been sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    return NextResponse.json({ error: 'An error occurred while submitting your message' }, { status: 500 });
  }
}
