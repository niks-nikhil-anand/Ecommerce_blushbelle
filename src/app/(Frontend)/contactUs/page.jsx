'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import contactUsImage from '../../../../public/frontend/contactUsImage.jpg'
import Image from 'next/image'
import { toast } from 'react-hot-toast';


export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('/api/admin/dashboard/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ firstName: '', lastName: '', email: '', mobileNumber: '', message: '' });
      } else {
        toast.error(data.message || 'Something went wrong!');
      }
    } catch (error) {
      toast.error('Failed to send message!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="relative h-64 w-full">
        <div className="absolute inset-0 ">
          <Image
            src="/frontend/ProductFeatures/Bg.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
        <div className="relative h-full flex items-center justify-center flex-col">
          <motion.h1
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Get in touch
          </motion.h1>
          <p className="mt-4 text-lg text-white">Our friendly team is here to assist you.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-7xl py-12 md:py-24">
          <div className="grid items-center justify-items-center gap-x-4 gap-y-10 lg:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="px-2 md:px-12">
                <p className="text-2xl font-bold text-gray-900 md:text-4xl">Leave Us a message</p>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid w-full gap-y-4 md:gap-x-4 lg:grid-cols-2">
                    <div className="grid w-full items-center gap-1.5">
                      <label className="text-sm font-medium text-gray-700" htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        className="h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm"
                        type="text"
                        id="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <label className="text-sm font-medium text-gray-700" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        className="h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm"
                        type="text"
                        id="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-700" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm"
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-700" htmlFor="mobileNumber">
                      Phone Number
                    </label>
                    <input
                      className="h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-sm"
                      type="tel"
                      id="mobileNumber"
                      placeholder="Enter your phone number"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-700" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      className="h-24 w-full rounded-md border border-gray-300 bg-gray-50  text-sm py-2 px-4"
                      id="message"
                      placeholder="Leave us a message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </div>
            </div>
            <motion.img
              alt="Contact us"
              className="hidden max-h-full w-full rounded-lg object-cover lg:block"
              src={contactUsImage.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      <hr className="mt-6" />
    </div>
  )
}
