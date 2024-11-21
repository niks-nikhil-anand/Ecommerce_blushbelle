import connectDB from "@/lib/dbConnect";
import cartModels from "@/models/cartModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ status: "error", msg: "ID parameter is required" }, { status: 400 });
  }
  try {
    await connectDB();

    const cartItem = await cartModels.findById(id);

    if (!cartItem) {
      return NextResponse.json({ status: "error", msg: "Cart item not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", data: cartItem }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart item:", error);
    return NextResponse.json({ status: "error", msg: "Error fetching cart item", error: error.message }, { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ status: "error", msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const cartItem = await cartModels.findByIdAndDelete(id);

    if (!cartItem) {
      return NextResponse.json({ status: "error", msg: "Cart item not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", msg: "Cart item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json({ status: "error", msg: "Error deleting cart item", error: error.message }, { status: 500 });
  }
};
