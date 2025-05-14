'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

// Import shadcn components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FAQs = () => {
  const faqs = [
    {
      question: 'What products does CleanVeda offer?',
      answer: 'CleanVeda specializes in plant-based Ayurvedic supplements designed to enhance mental performance and overall well-being. Our flagship product, BrainBite™ Smart IQ, is formulated to improve focus, cognitive energy, and mental clarity.',
    },
    {
      question: 'Is BrainBite™ Smart IQ safe for children?',
      answer: 'Yes, BrainBite™ Smart IQ is 100% plant-based and safe for children. It is designed to support learning, focus, and mental clarity in young minds.',
    },
    {
      question: 'What is your shipping policy?',
      answer: 'We offer free shipping on all orders. Once your order is placed, it will be processed and shipped promptly.',
    },
    {
      question: 'Do you provide international shipping?',
      answer: 'Currently, we only ship within India. We\'ll be sure to announce any expansion plans on our website.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We offer a variety of secure payment options, including credit cards (Visa & Mastercard), debit cards (Visa Electron & Maestro), net banking, UPI, and cash on delivery (COD).',
    },
    {
      question: 'How can I contact customer support?',
      answer: 'Our customer support team is available 24/7 to assist you. You can reach us at support@cleanveda.com or call us at +91 9876543210.',
    },
  ];

  return (
    <div>
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-64 w-full">
        <div className="absolute inset-0">
          <Image
            src="/frontend/ProductFeatures/Bg.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative h-full flex items-center justify-center flex-col">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg text-white/90 max-w-md text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Find answers to the most common questions about our products and services
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="border-none shadow-lg bg-white rounded-xl overflow-hidden">
              <div className="p-2 md:p-4">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <AccordionItem value={`item-${index}`} className="border-b border-green-100">
                        <AccordionTrigger className="py-5 text-left text-lg font-medium text-gray-800 hover:text-green-700 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-5 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
              <h3 className="text-xl font-bold text-green-800 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Our friendly team is ready to help with any additional questions you may have.
              </p>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  asChild
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200"
                >
                  <Link href="/contactUs">
                    Contact Our Support
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;