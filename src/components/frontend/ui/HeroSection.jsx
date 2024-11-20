"use client"
import React, { useState } from 'react';
import heroImage from '../../../../public/frontend/heroSection01.jpg'
import Image from 'next/image';
import toast from 'react-hot-toast';


const FitnessHeroSection = () => {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({  email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard/newsLetter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Subscription successful!');
        setFormData({email: '' });
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div class="bg-gray-50">
    <section class=" pb-12 sm:pb-16 lg:pt-8">
        <div class=" mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
            <div className=''>
                <Image
                src={heroImage}
                alt="Hero Section"
                layout="intrinsic" 
                width={800} 
                height={400}
                className="rounded-lg"
              />
                </div>
                <div>
    <div class="text-center lg:text-left">
        <h1 class="text-xl font-bold leading-tight text-gray-900 sm:text-xl sm:leading-tight lg:leading-tight lg:text-2xl font-pj">
            Sign up to get 15% off your first order and other great promos, giveaways, and news!
        </h1>
        <p class="mt-2 text-lg text-gray-600 sm:mt-8 font-inter">
            Get 15% off now and enjoy exclusive benefits tailored just for you.
        </p>

        <form onSubmit={handleSubscribe} class="mt-8 sm:mt-10">
            <div class="relative p-2 sm:border sm:border-gray-400 group sm:rounded-xl sm:focus-within:ring-1 sm:focus-within:ring-gray-900 sm:focus-within:border-gray-900">
                <input
                   type="email"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                    placeholder="Enter email address"
                    class="block w-full px-4 py-4 text-gray-900 placeholder-gray-900 bg-transparent border border-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-xl sm:border-none sm:focus:ring-0 sm:focus:border-transparent"
                    required=""
                />
                <div class="mt-4 sm:mt-0 sm:absolute sm:inset-y-0 sm:right-0 sm:flex sm:items-center sm:pr-2">
                    <button type="submit" class="inline-flex px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-lg focus:outline-none focus:bg-gray-600 font-pj hover:bg-gray-600">
                    {loading ? 'Sending...' : ' Get 15% Off Now'}
                    </button>
                </div>
            </div>
        </form>
    </div>

   
</div>


               
            </div>
        </div>
    </section>
</div>
  );
};

export default FitnessHeroSection;
