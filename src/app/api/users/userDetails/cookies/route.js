import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();

    // Get token from NextAuth (if available)
    console.log("Fetching token from NextAuth...");
    const token = await getToken({ req });
    console.log("NextAuth token:", token);

    const cookieStore = cookies();
    const authToken = cookieStore.get("userAuthToken");
    console.log("Cookie authToken:", authToken);

    // Check if either token from NextAuth or cookie exists
    const tokenToUse = token || (authToken && authToken.value ? jwt.decode(authToken.value) : null);
    console.log("Token to use:", tokenToUse);

    if (!tokenToUse || !tokenToUse.id) {
      console.error("Authentication token or ID is missing.");
      throw new Error("Authentication token or ID is missing.");
    }

    const id = tokenToUse.id;
    console.log("User ID:", id);

    const user = await userModels.findById(id);
    console.log("Retrieved user:", user);

    if (!user) {
      console.error("User not found.");
      throw new Error("User not found.");
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json({ msg: "Error retrieving user", error: error.message }, {
      status: 500,
    });
  }
};
