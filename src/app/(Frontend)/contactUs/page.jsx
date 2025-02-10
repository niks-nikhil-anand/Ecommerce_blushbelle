'use client'
import React from 'react'
import { motion } from 'framer-motion'
import contactUsImage from '../../../../public/frontend/contactUsImage.jpg'
import Image from 'next/image'

export default function Contact() {
  return (
    <div>
      <section className="relative h-64 w-full">
              <div className="absolute inset-0 mt-[-5px]">
                <Image
                  src="/frontend/ProductFeatures/Bg.png"
                  alt="Background Image"
                  layout="fill"
                  objectFit="cover "
                  quality={100}
                />
              </div>
              <div className="relative h-full flex items-center justify-center  flex-col">
                <motion.h1
                  className="text-4xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                Get in touch
                </motion.h1>
                <p className="mt-4 text-lg text-white">
                  Our friendly team is here to assist you.
                </p>
              </div>
            </section>
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-7xl py-12 md:py-24">
          <div className="grid items-center justify-items-center gap-x-4 gap-y-10 lg:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="px-2 md:px-12">
                <p className="text-2xl font-bold text-gray-900 md:text-4xl">Leave Us a message</p>
                <form className="mt-8 space-y-4">
                  <div className="grid w-full gap-y-4 md:gap-x-4 lg:grid-cols-2">
                    <div className="grid w-full items-center gap-1.5">
                      <label
                        className="text-sm font-medium leading-none text-gray-700"
                        htmlFor="first_name"
                      >
                        First Name
                      </label>
                      <input
                        className="flex h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        type="text"
                        id="first_name"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <label
                        className="text-sm font-medium leading-none text-gray-700"
                        htmlFor="last_name"
                      >
                        Last Name
                      </label>
                      <input
                        className="flex h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        type="text"
                        id="last_name"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label
                      className="text-sm font-medium leading-none text-gray-700"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="flex h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label
                      className="text-sm font-medium leading-none text-gray-700"
                      htmlFor="phone_number"
                    >
                      Phone Number
                    </label>
                    <input
                      className="flex h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      type="tel"
                      id="phone_number"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label
                      className="text-sm font-medium leading-none text-gray-700"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      className="flex h-24 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      id="message"
                      placeholder="Leave us a message"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Send Message
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
