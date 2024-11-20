"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaRegHeart } from "react-icons/fa";
import Image from 'next/image';
import Loader from '@/components/loader/loader';

const ProductCardUser = () => {
    const [userId, setUserId] = useState(null);
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
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the product data!", error);
                setLoading(false);
            });
    }, [loading]);

    useEffect(() => {
        // Fetch user details from the API
        const fetchUser = async () => {
          try {
            const response = await fetch('/api/users/userDetails/cookies');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setUserId(data._id); // Assuming the API returns an object with the `_id` field
          } catch (error) {
            console.error('Failed to fetch user details:', error);
          }
        };
    
        fetchUser();
      }, []);

    if (loading) {
        return (
            <Loader/>
        );
    }

    if (products.length === 0) {
        return <div>No products found.</div>;
    }
    const truncateText = (text, limit) => {
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
      };

    const handleCardClick = (id) => {
        router.push(`${userId}/product/${id}`);
    };

    const handleWishlistClick = () => {
        router.push('/auth/signIn');
    };

    return (
        <div className="flex flex-col mt-5 mb-4">
            <h2 className="text-xl md:text-4xl mb-4 text-center font-bold text-red-500">Fan Favorites</h2>
            <div className="flex gap-5 hover:cursor-pointer justify-center px-2 py-3 flex-wrap">
                {products.map(product => {
                    const { _id, name, originalPrice, featuredImage, salePrice } = product;

                    return (
                        <div
                        key={_id}
                        className="relative h-[30rem] w-full  md:w-[18rem] lg:h-[30rem] lg:w-[22rem] overflow-hidden rounded-3xl group" 
                        onClick={() => handleCardClick(_id)}
                    >
                        <div className= "absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-br-lg z-10">
                            Sale
                        </div>
                        <div className="absolute top-2 right-4 z-20">
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    handleWishlistClick();
                                }}
                                className="text-black font-bold hover:text-red-700 transition-colors"
                            >
                                <FaRegHeart size={24} />
                            </button>
                        </div>
                    
                        {/* Image */}
                        <div className="relative h-[30rem] w-full overflow-hidden rounded-3xl border border-gray-300">
                            <img
                                className="object-fill w-full h-full transition-transform duration-300 ease-in-out transform group-hover:scale-105" // Apply hover scaling on the group
                                src={featuredImage}
                                alt={name}
                            />
                            <h3 className="absolute bottom-7 left-5 text-center bg-opacity-50 text-red-500 text-lg sm:text-xl md:text-xl font-medium p-1 bg-white px-5 py-2 rounded-lg"> {truncateText(name, 10)} </h3>
                            <div className="absolute bottom-7 right-5 text-center bg-opacity-50 text-red-500 text-lg sm:text-xl md:text-xl font-medium p-1 bg-white px-5 py-2 rounded-lg">
                                <div className='flex flex-col'>
                                    <span className="text-gray-400 line-through mr-2">₹{originalPrice}</span>
                                    <span className="text-green-500 font-medium ml-4">₹{salePrice}</span>
                                </div>
                            </div>
                        </div>
                    
                        {/* Shop Now button (visible on hover) */}
                        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-black bg-white px-3 py-2 rounded-2xl text-lg font-bold">Shop Now</span>
                        </div>
                    </div>
                    
                    );
                })}
            </div>
        </div>
    );
};

export default ProductCardUser;
