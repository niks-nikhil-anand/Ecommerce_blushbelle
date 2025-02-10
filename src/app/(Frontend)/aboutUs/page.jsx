"use client"
import { motion } from 'framer-motion';
import { FaLeaf, FaFlask, FaHandsHelping, FaRecycle } from 'react-icons/fa';
import Group1 from '../../../../public/frontend/heroSection/Group1.png';
import Image from 'next/image';

function AboutUs() {
  const values = [
    {
      icon: <FaLeaf className="text-green-500 text-4xl mb-4 mx-auto" />,
      title: 'Natural Ingredients',
      description: 'We prioritize using natural, plant-based ingredients in all our products.',
    },
    {
      icon: <FaFlask className="text-green-500 text-4xl mb-4 mx-auto" />,
      title: 'Innovative Formulations',
      description: 'Our team develops innovative formulations to enhance health and beauty.',
    },
    {
      icon: <FaHandsHelping className="text-green-500 text-4xl mb-4 mx-auto" />,
      title: 'Community Support',
      description: 'We are committed to supporting and giving back to our community.',
    },
    {
      icon: <FaRecycle className="text-green-500 text-4xl mb-4 mx-auto" />,
      title: 'Sustainability',
      description: 'We focus on sustainable practices to protect our planet for future generations.',
    },
  ];
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative">
        <img
          src="path_to_high_quality_image.jpg"
          alt="Natural wellness"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-green-900 bg-opacity-50 flex items-center justify-center">
          <motion.h1
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            About CleanVeda
          </motion.h1>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-12 px-4 md:px-16">
        <div className="md:flex md:items-center">
          <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4">Our Commitment to Natural Wellness</h2>
          <p className="mb-6">
            At CleanVeda.com, we are dedicated to providing premium natural health supplements, herbal personal care products, and rejuvenating skin and hair care solutions. Our effective, plant-based formulations are meticulously crafted to promote holistic health, vitality, and beauty.
          </p>
          <p>
            Explore our range of organic, cruelty-free products today, and enhance your health and beauty regimen with the transformative power of nature.
          </p>
          </div>
          <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0 flex justify-end">
          <Image
              src="/frontend/heroSection/Group1.png"
              alt="CleanVeda products"
              width={600} // Replace with the actual width of your image
              height={400} // Replace with the actual height of your image
              className="w-[20rem] h-auto "
            />
          </div>
        </div>
      </section>

      {/* Values and Mission */}
      <section className="bg-gray-100 py-12 px-4 md:px-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Our Values</h2>
        <div className="flex flex-wrap justify-center">
        <div className="flex flex-wrap justify-center">
      {values.map((value, index) => (
        <div key={index} className="w-full md:w-1/3 p-4">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            {value.icon}
            <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
            <p>{value.description}</p>
          </div>
        </div>
      ))}
    </div>
          {/* Repeat similar blocks for other values */}
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
