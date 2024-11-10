"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch user details from the API
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/userDetails/cookies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        setUserId(data._id); // Assuming the API returns an object with the `_id` field
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLinkClick = (link) => {
    console.log('User ID:', userId); // Debugging line
    if (userId) {
      // Redirect to the user-specific route
      router.push(`/users/${userId}${link}`);
    } else {
      console.log('Redirecting to default link:', link); // Debugging line
      // Fallback to the default URL
      router.push(link);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Implement subscription logic here
    if (!name || !email) {
      setError('Both fields are required!');
      return;
    }
    // Reset error and handle the submission logic here
    setError('');
    console.log('Submitting:', { name, email });
    // You can add the API call to subscribe the user here
  };

  return (
    <footer className="bg-gray-50 py-10 shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-orange-500">Useful Links</h3>
          <div className="w-16 h-1 bg-purple-600 mb-4"></div>
          <ul className="space-y-2">
            {[
              { name: 'Shop', url: '/product/shopAllProducts' },
              { name: 'ContactUs', url: '/ContactUs' },
              { name: 'Blog', url: '/blog' },
              { name: 'International Orders', url: '/international-orders' },
              { name: 'International Distributors', url: '/international-distributors' },
              { name: 'About Us', url: '/AboutUs' },
              { name: 'Feedback', url: '/feedback' }
            ].map((link) => (
              <li key={link.name} className="hover:underline cursor-pointer">
                <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(link.url); }}>{link.name}</a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-orange-500">Resources</h3>
          <div className="w-16 h-1 bg-purple-600 mb-4"></div>
          <ul className="space-y-3">
            {[
              { name: 'Home', url: '/' },
              { name: 'Shipping and Return Policies', url: '/returnPolicy' },
              { name: '60-Day Satisfaction Guarantee', url: '/guarantee' },
              { name: 'Privacy Policy', url: '/privacyPolicy' },
              { name: 'Terms & Condition', url: '/termsAndConditions' },
              { name: 'CCPA Notice', url: '/ccpa' },
              { name: 'Affiliate Program', url: '/affiliate' }
            ].map((link) => (
              <li key={link.name} className="hover:underline cursor-pointer">
                <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick(link.url); }}>{link.name}</a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Subscription Form */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-black text-center">Get 15% Off</h3>
          <p className="text-sm text-black font-medium text-center">Sign up to get 15% off your first order and other great promos, giveaways, and news!</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black p-4 rounded-md focus:ring-2"
              required
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-black p-4 rounded-md focus:ring-2"
              required
            />
            {error && <p className="text-red-500">{error}</p>}
            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white p-3 rounded-md font-bold shadow-lg hover:bg-purple-700"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
      <div className="mt-10 text-center text-sm text-black">
        <p>Copyright © 2024, <a href="#" className="text-black underline">BlushBelle Nutrition</a></p>
        <div className="mt-4 p-4 flex justify-center items-center flex-col">
          <div className='md:w-[50rem] w-[20rem] rounded-lg border border-gray-200 px-5 md:py-8 py-5'>
            <p className='text-center'>50% OFF discount valid on Superfruit Max Gummies at BlushBelle.com. Discount not applicable on repeating subscription orders. Discount automatically applied at checkout. Offer valid until 11/15/24 at 11:59 PM MST. Offer may be modified or terminated at any time. Exclusions apply.</p>
            <p className="mt-2 text-center">**These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure or prevent any disease.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
