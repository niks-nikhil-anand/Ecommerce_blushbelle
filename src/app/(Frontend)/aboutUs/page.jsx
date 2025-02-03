'use client'
import React from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

const locations = [
  {
    title: 'Main Branch',
    address: 'Kozy Biotech , 25, City Plaza, Kayam Nagar , Bhojpur',
    PinCode: '802314',
  },
]



export default function AboutPageOne() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-8 pb-10 pt-12 md:pt-24"
        >
          <div className="max-w-max rounded-full border bg-gray-50 p-1 px-3">
            <p className="text-xs font-semibold leading-normal md:text-sm">About the Cleanveda</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 md:text-5xl md:leading-10">
            Made with love, right here in India
          </p>
          <p className="w-full text-base text-gray-600 md:text-xl">
          Unlock optimal wellness at CleanVeda.com with our premium natural health supplements, herbal personal care products, and rejuvenating skin and hair care solutions. Discover effective, plant-based formulations crafted for holistic health, vitality, and beauty. Shop our organic, cruelty-free products today and elevate your health and beauty regimen with the power of nature!
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-4"
        >
          <img
            className="h-[200px] w-full rounded-xl object-cover md:h-full"
            src="https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/google-map.jpg"
            alt="Google Map"
          />
        </motion.div>
        {/* Locations */}
        <div className="my-8 flex flex-col gap-y-6 md:flex-row justify-start">
          {locations.map((location) => (
            <motion.div
              key={location.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col space-y-3 md:w-2/4 lg:w-1/5"
            >
              <FaMapMarkerAlt className="h-5 w-5" />
              <p className="w-full text-xl font-semibold text-gray-900">Kozy Biorech</p>
              <p className="text-sm font-medium">{location.address}</p>
            </motion.div>
          ))}
        </div>
        <hr className="mt-20" />
        {/* Greetings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-16 flex items-center"
        >
          <div className="space-y-6 md:w-3/4 ">
            <div className="max-w-max rounded-full border bg-gray-50 p-1 px-3">
              <p className="text-xs font-semibold leading-normal md:text-sm">Join Us &rarr;</p>
            </div>
            <p className="text-3xl font-bold text-gray-900 md:text-4xl">Meet our team</p>
            <p className="max-w-4xl text-base text-gray-700 md:text-xl">
              Our philosophy is simple — hire a team of diverse, passionate people and foster a
              culture that empowers you to do your best work.
            </p>
          </div>
        </motion.div>
        <hr className="mt-20" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-x-4 gap-y-4 py-16 md:flex-row"
        >
          <div className="space-y-6">
            <p className="text-sm font-semibold md:text-base">Join our team &rarr;</p>
            <p className="text-3xl font-bold md:text-4xl">We&apos;re just getting started</p>
            <p className="text-base text-gray-600 md:text-lg">
              Our philosophy is simple — hire a team of diverse, passionate people and foster a
              culture that empowers you to do your best work.
            </p>
            <button
              type="button"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white md:px-6 md:py-3"
            >
              We are hiring
            </button>
          </div>
          <div className="w-full">
            <img
              src="https://plus.unsplash.com/premium_photo-1683121855240-5d3f67a5fdec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGlyaW5nfGVufDB8fDB8fHww"
              className="max-w-full rounded-lg object-cover"
              alt="Hiring Banner"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
