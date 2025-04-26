// app/api/auth/firebase-login/route.ts
import connectDB from "@/lib/dbConnect";
import userModels from "@/models/userModels";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { admin } from "@/lib/firebaseAdmin";

export const POST = async (req) => {
  try {
    await connectDB();

    const { idToken, provider, phoneNumber } = await req.json();

    if (!idToken || !provider) {
      return NextResponse.json({ msg: "Authentication details required" }, { status: 400 });
    }

    // For phone authentication flow
    if (provider === 'phone') {
      if (!phoneNumber) {
        return NextResponse.json({ msg: "Phone number is required" }, { status: 400 });
      }

      // Verify the Firebase ID token
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log(decodedToken)
        console.log(phoneNumber)
        
        // Verify the phone number matches
        if (decodedToken.phone_number !== phoneNumber) {
          return NextResponse.json({ msg: "Phone number verification failed" }, { status: 401 });
        }
        
        // Find user by phone number
        let user = await userModels.findOne({ mobileNumber:phoneNumber });
        console.log(user)

        if(!user){
          return NextResponse.json({ msg: "User not found" }, { status: 404 });

        }

        // Check if user is active
        if (user.status !== "Active" || user.role !== "User") {
          return NextResponse.json({ msg: "Account is not active" }, { status: 403 });
        }

        // Generate JWT token
        const token = generateToken({ id: user._id, phoneNumber: user.phoneNumber });

        // Create response with token in cookie
        const response = NextResponse.json(
          { msg: "Login successful", userId: user._id },
          { status: 200 }
        );

        // Set cookie with JWT token
        response.cookies.set("userAuthToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        });

        return response;
      } catch (firebaseError) {
        console.error("Firebase token verification error:", firebaseError);
        return NextResponse.json(
          { msg: "Invalid or expired token", error: firebaseError.message },
          { status: 401 }
        );
      }
    } else {
      // For other providers (email, etc.) - can be extended as needed
      return NextResponse.json({ msg: "Unsupported authentication provider" }, { status: 400 });
    }
  } catch (error) {
    console.error("Server error during authentication:", error);
    return NextResponse.json(
      { msg: "Error during authentication", error: error.message },
      { status: 500 }
    );
  }
};

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1w" });
}