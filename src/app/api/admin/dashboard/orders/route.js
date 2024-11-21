
import connectDB from "@/lib/dbConnect";
import orderModels from "@/models/orderModels";
import { NextResponse } from "next/server";


export const GET = async (request, { params }) => {
  try {
    await connectDB();
    console.log("Database connected successfully for GET request on Orders");

    const order = await orderModels.find();
    console.log("Order data fetched:", order); // Debug fetched order data

    if (!order) {
      console.log("Order not found with ID:", id);
      return NextResponse.json({ status: "error", msg: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", data: order }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ status: "error", msg: "Error fetching order", error: error.message }, { status: 500 });
  }
};
