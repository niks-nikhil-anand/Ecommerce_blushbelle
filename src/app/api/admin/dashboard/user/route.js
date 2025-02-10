import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      console.log("Connecting to the database...");
      await connectDB();
      console.log("Connected to the database.");
  
      // Fetch all newsletter subscriptions
      const users = await userModels.find();
  
      return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'An error occurred while fetching users' }, { status: 500 });
    }
  }