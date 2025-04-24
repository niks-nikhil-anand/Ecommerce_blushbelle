import { useState } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
import Image from "next/image";
import { firebaseApp } from '@/lib/firebaseConfig';
import { Button } from "@/components/ui/button";

const SocialLogin = ({ router }) => {
  const [loading, setLoading] = useState(false);
  
  // Initialize Firebase auth

  const handleProviderSignIn = async (provider) => {
    try {
      setLoading(true);
      let authProvider;
      
      if (provider === "google") {
        authProvider = new GoogleAuthProvider();
      } else if (provider === "facebook") {
        authProvider = new FacebookAuthProvider();
      }
      
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;
      
      // After successful Firebase auth, sync with your backend
      const idToken = await user.getIdToken();
      const response = await axios.post('/api/auth/firebase-login', { 
        idToken,
        provider,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      if (response.status === 200) {
        toast.success("Login successful!");
        router.push(`/users/${response.data.userId}`);
      }
    } catch (error) {
      console.error("Error during sign-in:", error.message);
      toast.error(error.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
      <Button 
        variant="outline" 
        onClick={() => handleProviderSignIn("google")}
        className="flex items-center justify-center space-x-3 hover:shadow-md transition-all h-12 bg-white border-gray-300 text-gray-700"
        disabled={loading}
      >
        <Image src="/IconHub/GoogleIcons.png" alt="Google" width={20} height={20} />
        <span className="font-medium">Sign in with Google</span>
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => handleProviderSignIn("facebook")}
        className="flex items-center justify-center space-x-3 hover:shadow-md transition-all h-12 bg-white border-gray-300 text-gray-700"
        disabled={loading}
      >
        <Image src="/IconHub/facebookIcon.png" alt="Facebook" width={20} height={20} />
        <span className="font-medium">Sign in with Facebook</span>
      </Button>
    </div>
  );
};

export default SocialLogin;