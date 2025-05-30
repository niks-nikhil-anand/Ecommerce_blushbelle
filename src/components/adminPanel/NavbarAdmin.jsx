"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, LogOut } from "lucide-react";
import { toast } from 'react-hot-toast';

// Import shadcn components
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Logged out successfully!', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
          },
          icon: '👋',
        });
        
        // Short delay to show the toast before redirecting
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        toast.error(`Logout failed: ${data.message}`, {
          duration: 4000,
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(`Logout failed: ${error.message || 'An unexpected error occurred'}`, {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  return (
    <nav className="bg-white text-black transition-colors duration-300 shadow-lg border-b-2">
      {/* Add Toaster component from react-hot-toast */}      
      <div className="flex justify-between items-center px-4 py-5">
        {/* Hamburger Menu for Mobile View */}
        <div className="block lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-8">
                {/* Mobile navigation links can go here */}
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-white text-black border-gray-300"
                  onClick={handleLogout}
                >
                  <span>Logout</span>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo Section */}
        <div className="flex items-center justify-center">
          <Image src="/logo/cleanvedaLogo.png" alt="Logo" width={80} height={50} className="mr-4" />
        </div>

        {/* Title Section */}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-black font-cursive" style={{ fontFamily: "Dancing Script, cursive" }}>
            Cleanveda Super Admin Panel
          </h1>
        </div>

        {/* Right Section: Logout Button */}
        <div className="hidden lg:flex items-center">
          <Button 
            variant="outline"
            className="flex items-center gap-2 bg-white text-black border-gray-300 py-4"
            onClick={handleLogout}
          >
            <span>Logout</span>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;