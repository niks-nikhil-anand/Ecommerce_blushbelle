import connectDB from '@/lib/dbConnect';
import userModels from '@/models/userModels';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    try {
        console.log('Connecting to the database...');
        await connectDB(); 
        console.log('Database connection established.');

        // Parse the JSON body of the request
        const body = await req.json();
        const { email, password, rememberMe } = body;
        
        // Log values but mask password
        console.log('Received request with:', { 
            email, 
            password: password ? '********' : undefined, 
            rememberMe 
        });

        // Validate required fields
        if (!email) {
            console.log('Email is missing in request');
            return NextResponse.json({ msg: "Email is required" }, { status: 400 });
        }

        if (!password) {
            console.log('Password is missing in request');
            return NextResponse.json({ msg: "Password is required" }, { status: 400 });
        }

        // Find the user by email
        console.log('Finding user by email:', email);
        const user = await userModels.findOne({ email });

        // If user not found, return 401
        if (!user) {
            console.log('User not found:', email);
            return NextResponse.json({ msg: "User Not Found" }, { status: 401 });
        }

        // Compare the provided password with the hashed password in the database
        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match for email:', email);
            return NextResponse.json({ msg: "Invalid email or password" }, { status: 401 });
        }

        // Check if user status is "Active"
        console.log('Checking user status...');
        if (user.status !== 'Active') {
            console.log('User status is not Active:', user.status);
            return NextResponse.json({ msg: "Account is not active" }, { status: 403 });
        }

        // Check if the user's role matches the required role
        console.log('Checking user role...');
        if (user.role !== 'User') {
            console.log('User role is not authorised:', user.role);
            return NextResponse.json({ msg: "Not Authorised" }, { status: 403 });
        }

        // Generate a JWT token
        console.log('Generating token...');
        const token = generateToken({ id: user._id, email: user.email });

        // Create response with user ID
        const response = NextResponse.json({ 
            msg: "Login successful", 
            userId: user._id.toString() // Send the user ID to the client
        }, { status: 200 });

        // Set the cookie with the token
        console.log('Setting cookie with token...');
        response.cookies.set('userAuthToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 1 month if 'rememberMe', otherwise 1 week
            path: '/'
        });

        console.log('Login successful for user:', email);
        return response;

    } catch (error) {
        console.error('Error processing login:', error);
        return NextResponse.json({ msg: "Error processing login", error: error.message || error }, { status: 500 });
    }
};

// Function to generate a JWT token
function generateToken(user) {
    console.log('Generating token for user:', user);
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1w' });
}