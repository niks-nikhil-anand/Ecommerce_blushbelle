"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const Page = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
      <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">Find answers to the most common questions about our products, shipping, payments, and more.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
            {faqs.map((faq, index) => (
              <div key={index} className="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50">
                <button
                  type="button"
                  className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="flex text-lg font-semibold text-black">{faq.question}</span>

                  <svg
                    className={`w-6 h-6 text-gray-400 transform ${openIndex === index ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`px-4 pb-5 sm:px-6 sm:pb-6 ${openIndex === index ? 'block' : 'hidden'}`}>
                  <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 textbase mt-9">
            Didn’t find the answer you are looking for?{' '}
            <Link href="/contactUs" className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline">
              Contact our support
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Page;