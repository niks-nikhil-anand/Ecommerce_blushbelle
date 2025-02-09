import connectDB from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';


export const GET = async (req) => {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Database connection successful.");

    const cookieStore = cookies();
    const pendingOrder = cookieStore.get("pendingOrder");

    if (!pendingOrder) {
      console.error("User authentication token is missing.");
      throw new Error("User authentication token is missing.");
    }


    const decodedToken = jwt.decode(pendingOrder.value); 

    if (!decodedToken || !decodedToken.cartId || !decodedToken.addressId) {
      console.error("Invalid token. No order ID found.");
      throw new Error("Invalid token.");
    }

    return NextResponse.json(decodedToken, {
      status: 200,
    });
    
  } catch (error) {
    console.error("Error retrieving Partner:", error);
    return NextResponse.json({ msg: "Error retrieving Partner", error: error.message }, {
      status: 500,
    });
  }
};
