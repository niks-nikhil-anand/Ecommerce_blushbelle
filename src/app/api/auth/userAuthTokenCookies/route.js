import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import connectDB from "@/lib/dbConnect";
import userModels from '@/models/userModels';

export const dynamic = 'force-dynamic'; // 🛠️ this is important!

export const GET = async (req) => {
  try {
    await connectDB();

    const cookieStore = cookies();
    const authToken = cookieStore.get("userAuthToken");

    if (!authToken) {
      throw new Error("User authentication token is missing.");
    }

    const decodedToken = jwt.verify(authToken.value, process.env.JWT_SECRET);
    if (!decodedToken || !decodedToken.email) {
      throw new Error("Invalid token.");
    }

    const email = decodedToken.email;

    const User = await userModels.find({ email });
    if (!User) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json(User, { status: 200 });
  } catch (error) {
    console.error("Error retrieving User:", error);
    return NextResponse.json({ msg: "Error retrieving User", error: error.message }, { status: 500 });
  }
};
