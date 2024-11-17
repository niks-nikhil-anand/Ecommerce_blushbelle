"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaRegHeart } from "react-icons/fa";
import Image from 'next/image';
import Loader from '@/components/loader/loader';
const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 100) return prev + 1;
                    clearInterval(interval);
                    return 100;
                });
            }, 30);
        }

        axios.get('/api/admin/dashboard/product/addProduct')
            .then(response => {
                console.log(response.data)
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the product data!", error);
                setLoading(false);
            });
    }, [loading]);

    if (loading) {
        return (
            <Loader />
        );
    }

    if (products.length === 0) {
        return <div>No products found.</div>;
    }

    const truncateText = (text, limit) => {
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
    };

    const handleCardClick = (id) => {
        router.push(`/product/${id}`);
    };

    const handleWishlistClick = () => {
        router.push('/auth/signIn');
    };

    return (
        <div className="flex flex-col mt-5 mb-4">
        <h2 className="text-xl md:text-4xl mb-4 text-center font-bold text-red-500">Fan Favorites</h2>
        <div className="flex justify-center py-3 flex-wrap hover:cursor-pointer relative">
          {products.map(({ _id, name, originalPrice, featuredImage, salePrice, description, productHighlights }, index) => (
            <div
              key={_id}
              className={`flex flex-col items-center py-6 px-4 md:px-6 shadow-md border-b-2 border-black w-full lg:w-full ${
                index % 2 === 0 ? 'bg-[#F3E3EC]' : 'bg-[#D0D2ED]'
              }`}
              onClick={() => handleCardClick(_id)}
            >
              <div className="flex flex-col lg:flex-row items-center gap-6 justify-center w-full">
                <div className="text-left lg:mr-6 max-w-full lg:max-w-[50%]">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{name}</h1>
                  <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-4">{description}</p>
                  <div className="flex gap-4 items-center">
                    {originalPrice > salePrice && (
                      <p className="text-base md:text-xl font-bold text-gray-500 line-through">
                        ₹{originalPrice}0
                      </p>
                    )}
                    <p className="text-lg md:text-2xl font-bold text-orange-500">₹{salePrice}0</p>
                  </div>
                  <button
                    className="bg-orange-500 text-white font-semibold py-2 px-4 mt-4 rounded-full hover:bg-orange-600 transition"
                    onClick={() => handleCardClick(_id)}
                  >
                    SHOP NOW
                  </button>
                </div>
      
                <div className="mt-6 lg:mt-0 w-full md:w-[10rem] h-auto relative">
                  <img
                    src={featuredImage}
                    alt="Product Image"
                    className="w-full lg:w-[20rem] h-auto object-cover shadow-md"
                    style={{
                      borderRadius: "0 0 3rem 3rem",
                      clipPath: "inset(0px 0px 0px 0px round 0px 0px 3rem 3rem)",
                    }}
                  />
                </div>
              </div>
      
              {productHighlights && productHighlights.length > 0 ? (
                <div className="flex gap-6 mt-8 justify-center w-full flex-wrap lg:flex-nowrap">
                  {productHighlights.slice(0, 3).map((highlight) => (
                    <FeatureCard
                      key={highlight._id}
                      icon={highlight.icon}
                      title={highlight.title}
                      description={highlight.description}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm md:text-base mt-4">No highlights available</p>
              )}
            </div>
          ))}
        </div>
      </div>
      

    );
};

const FeatureCard = ({ icon, title, description }) => {
    const limitedDescription = description.split(" ").slice(0, 15).join(" ") + (description.split(" ").length > 15 ? "..." : "");

    return (
        <div className="flex flex-col justify-start text-left p-4 ">
            <div className="bg-white rounded-b-full w-20 h-20 flex items-start justify-start ml-0 overflow-hidden p-2">
                <img src={icon} alt={title} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold mt-2 text-left text-red-600">{title}</h3>
            <div className=''>
                <p className="text-gray-600 text-left font-semibold">{limitedDescription}</p>
            </div>
        </div>
    );
};


export default ProductCard;
