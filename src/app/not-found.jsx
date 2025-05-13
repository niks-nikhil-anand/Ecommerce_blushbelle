"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-8 md:py-12 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <AlertTriangle size={80} className="text-white mb-6" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            404 - Page Not Found
          </h1>
        </div>
        
        <div className="px-6 py-8 md:px-12 md:py-10 flex flex-col items-center">
          <p className="text-lg text-gray-600 text-center mb-6">
            Oops! The page you're looking for seems to have wandered off.
          </p>
          
          <div className="space-y-4 w-full max-w-xs">
            <p className="text-sm text-gray-500 text-center">
              It might have been moved, deleted, or never existed in the first place.
            </p>
            
            <div className="border-t border-gray-200 my-6"></div>
            
            <div className="space-y-4 w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors duration-200">
                  <ArrowLeft size={18} />
                  Return to Homepage
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/contactUs" className="flex items-center justify-center w-full py-3 px-4 border border-green-600 text-green-600 hover:bg-green-50 rounded-md font-medium transition-colors duration-200">
                  Contact Support
                </Link>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              If you believe this is an error, please{" "}
              <Link href="/contactUs" className="text-green-600 hover:underline">
                let us know
              </Link>
              .
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}