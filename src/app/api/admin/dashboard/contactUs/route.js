'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import contactUsImage from '../../../../public/frontend/contactUsImage.jpg'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function Contact() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    message: ''
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/dashboard/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ first_name: '', last_name: '', email: '', phone_number: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div>
      <section className="relative h-64 w-full">
        <div className="absolute inset-0 mt-[-5px]">
          <Image src="/frontend/ProductFeatures/Bg.png" alt="Background Image" layout="fill" objectFit="cover" quality={100} />
        </div>
        <div className="relative h-full flex items-center justify-center flex-col">
          <motion.h1 className="text-4xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            Get in touch
          </motion.h1>
          <p className="mt-4 text-lg text-white">Our friendly team is here to assist you.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-24">
        <div className="grid items-center justify-items-center gap-x-4 gap-y-10 lg:grid-cols-2">
          <div className="flex items-center justify-center px-2 md:px-12">
            <p className="text-2xl font-bold text-gray-900 md:text-4xl">Leave Us a message</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4 w-full">
              <div className="grid gap-y-4 md:gap-x-4 lg:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700" htmlFor="first_name">First Name</label>
                  <input className="input-field" type="text" id="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter your first name" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700" htmlFor="last_name">Last Name</label>
                  <input className="input-field" type="text" id="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter your last name" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <input className="input-field" type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="phone_number">Phone Number</label>
                <input className="input-field" type="tel" id="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Enter your phone number" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="message">Message</label>
                <textarea className="input-field h-24" id="message" value={formData.message} onChange={handleChange} placeholder="Leave us a message" required />
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn-primary w-full">
                Send Message
              </motion.button>
            </form>
          </div>
          <motion.img alt="Contact us" className="hidden max-h-full w-full rounded-lg object-cover lg:block" src={contactUsImage.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
        </div>
      </div>
      <hr className="mt-6" />
    </div>
  );
}
