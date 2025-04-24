import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import orderModels from '@/models/orderModels';
import connectDB from '@/lib/mongodb'; // make sure this connects Mongoose

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    const cookieStore = cookies();
    const authToken = cookieStore.get('userAuthToken');

    if (!authToken?.value) {
      console.log('No authentication token found.');
      return NextResponse.json({ message: 'User not logged in' }, { status: 401 });
    }

    // Verify and decode the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(authToken.value, process.env.JWT_SECRET);
    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = decodedToken.id;
    if (!userId) {
      console.log('Decoded token does not contain user ID:', decodedToken);
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 400 });
    }

    // Fetch order history
    const orderHistory = await orderModels.find({ user: userId });

    return NextResponse.json(orderHistory);
  } catch (error) {
    console.error('Error retrieving order history:', error);
    return NextResponse.json(
      { message: 'Order retrieval failed', error: error.message },
      { status: 500 }
    );
  }
}
