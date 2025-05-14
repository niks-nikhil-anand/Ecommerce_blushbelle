'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { FaLeaf, FaFlask, FaHandsHelping, FaRecycle } from 'react-icons/fa'

// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AboutUs() {
  // Company values
  const values = [
    {
      icon: <FaLeaf className="text-green-500 text-4xl" />,
      title: 'Natural Ingredients',
      description: 'We prioritize using natural, plant-based ingredients in all our products.',
    },
    {
      icon: <FaFlask className="text-green-500 text-4xl" />,
      title: 'Innovative Formulations',
      description: 'Our team develops innovative formulations to enhance health and beauty.',
    },
    {
      icon: <FaHandsHelping className="text-green-500 text-4xl" />,
      title: 'Community Support',
      description: 'We are committed to supporting and giving back to our community.',
    },
    {
      icon: <FaRecycle className="text-green-500 text-4xl" />,
      title: 'Sustainability',
      description: 'We focus on sustainable practices to protect our planet for future generations.',
    },
  ];

  // Contact information cards - updated to match Contact page style
  const contactInfo = [
    { 
      icon: <Phone className="h-6 w-6 text-green-600" />, 
      title: "Phone", 
      details: "+91 9876543210", 
      description: "Monday-Friday from 8am to 5pm"
    },
    { 
      icon: <Mail className="h-6 w-6 text-green-600" />, 
      title: "Email", 
      details: "support@cleanveda.com", 
      description: "We'll respond within 24 hours"
    },
    { 
      icon: <MapPin className="h-6 w-6 text-green-600" />, 
      title: "Office", 
      details: " F-13/17, Jogabai Extension, Okhla.", 
      description: "New Delhi, 110025"
    }
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-64 w-full">
        <div className="absolute inset-0">
          <Image
            src="/frontend/ProductFeatures/Bg.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover "
            quality={100}
          />
        </div>
        <div className="relative h-full flex items-center justify-center flex-col">
          <motion.h1
            className="text-2xl md:text-4xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            About CleanVeda
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg text-white/90 max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Natural wellness products for a healthier lifestyle
          </motion.p>
        </div>
      </section>

      {/* Company Story */}
      <div className="mx-auto max-w-7xl px-4 mt-16">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Commitment to Natural Wellness</h2>
            <p className="text-lg text-gray-700">
              At CleanVeda.com, we are dedicated to providing premium natural health supplements, herbal personal care products, and rejuvenating skin and hair care solutions. Our effective, plant-based formulations are meticulously crafted to promote holistic health, vitality, and beauty.
            </p>
            <p className="text-lg text-gray-700">
              Explore our range of organic, cruelty-free products today, and enhance your health and beauty regimen with the transformative power of nature.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/frontend/heroSection/Group1.png"
                alt="CleanVeda products"
                width={500}
                height={400}
                className="object-cover rounded-xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Separator className="my-16 max-w-7xl mx-auto" />

      {/* Values Section */}
      <div className="mx-auto max-w-7xl px-4 my-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            These core principles guide everything we do at CleanVeda, from product development to customer service.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <CardHeader className="text-center pt-8">
                  <div className="bg-green-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              To provide effective, all-natural wellness products that enhance lives while respecting our environment. 
              We believe in the power of nature to heal, rejuvenate, and promote balance in both body and mind.
            </p>
          </motion.div>
          
          <motion.div
            className="bg-white rounded-xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainability Commitment</h3>
                <p className="text-gray-700">
                  At CleanVeda, we&apos;re dedicated to sustainable practices throughout our supply chain. 
                  From responsibly sourced ingredients to eco-friendly packaging, we strive to minimize 
                  our environmental impact while maximizing the benefits of our products.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Contact Info Section - Updated to match Contact page styling */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our products or want to learn more about CleanVeda? 
              Our friendly team is here to help.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.3 }}
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="bg-green-100 p-3 rounded-full">
                      {info.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                      <CardDescription>{info.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-green-600">{info.details}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Added Contact CTA section */}
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
              <h3 className="text-xl font-bold text-green-800 mb-4">Need more assistance?</h3>
              <p className="text-gray-600 mb-6">
                For detailed inquiries or product-specific questions, visit our contact page to send us a message.
                We&apos;ll get back to you as soon as possible.
              </p>
              <motion.a 
                href="/contactUs"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200"
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}