// lib/firebaseAdmin.js
import admin from 'firebase-admin';

// Check if the Firebase Admin SDK is already initialized
if (!admin.apps.length) {
  try {
    // Get the private key from environment variable
    // Firebase private keys contain newline characters that need to be preserved
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;
    
    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY environment variable is not set');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
      }),
    });
    
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    // Log more details about the error
    if (error.errorInfo) {
      console.error('Error details:', error.errorInfo);
    }
    throw error;
  }
}

export { admin };