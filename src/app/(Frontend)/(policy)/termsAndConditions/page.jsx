"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '@/components/loader/loader';
import waveSvg from '../../../../../public/frontend/SvgAssets/wave-white.svg';
import Image from 'next/image';
import DOMPurify from 'dompurify';

const Page = () => {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/admin/dashboard/policy/termsAndCondition`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center text-red-500 text-lg p-4">Error: {error}</div>;
    }

    // Sanitize the HTML content before rendering
    const sanitizedContent = DOMPurify.sanitize(data.content);

    return (
       <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.5 }}
                   className="w-full bg-white flex flex-col"
               >
                    <section className="relative h-64 w-full mb-5">
                           <div className="absolute inset-0">
                             <Image
                               src="/frontend/ProductFeatures/Bg.png"
                               alt="Background Image"
                               layout="fill"
                               objectFit="cover "
                               quality={100}
                             />
                           </div>
                           <div className="relative h-full flex items-center justify-center">
                             <motion.h1
                               className="text-4xl font-bold text-white"
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               transition={{ duration: 1 }}
                             >
                               Terms and Condition
                             </motion.h1>
                           </div>
                         </section>

            {/* Content */}
            <div className="md:w-15/20 w-full px-4 md:px-12 mx-auto overflow-x-hidden">
       <div 
        className="prose md:prose-base prose-sm max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
     </div>

        </motion.div>
    );
};

export default Page;
