import connectDB from "@/lib/dbConnect";
import pendingOrder from "@/models/pendingOrder";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    await connectDB();
    console.log("Database connected successfully for GET request on Orders");

    const orders = await pendingOrder
      .find().populate()

    console.log("Order data fetched:", orders); // Debug fetched order data

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { status: "error", msg: "Orders not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", data: orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { status: "error", msg: "Error fetching orders", error: error.message },
      { status: 500 }
    );
  }
};