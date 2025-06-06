import connectDB from "@/lib/dbConnect";
import orderModels from "@/models/orderModels";
import addressModels from "@/models/addressModels";
import cartModels from "@/models/cartModels";
import { Coupon } from "@/models/couponModels";
import userModels from "@/models/userModels";

import { NextResponse } from "next/server";


export const GET = async (request) => {
  try {
    await connectDB();
    console.log("Database connected successfully for GET request on Orders");

    const orders = await orderModels
    .find()
    .populate("user")
    .populate("cart")
    .populate("address")
    .populate("coupon")



    console.log("Order data fetched:", orders);

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
