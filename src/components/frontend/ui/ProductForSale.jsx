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
            <div className="flex justify-center px-2 py-3 flex-wrap hover:cursor-pointer relative ">
                {products.map(({ _id, name, originalPrice, featuredImage, salePrice, description, productHighlights }) => (
                    <div
                        className="flex flex-col items-center bg-[#F3E3EC] py-12 px-6  shadow-md border-b-2 border-black"
                        key={_id}
                        onClick={() => handleCardClick(_id)}
                    >
                        <div className="flex flex-col lg:flex-row items-center gap-10 justify-center">
                            <div className="text-left lg:mr-6 max-w-[50%]">
                                <h1 className="text-3xl font-bold mb-2">{name}</h1>
                                <p className="text-gray-700 mb-2">{description}</p>
                                <div className='flex gap-5'>
                                {originalPrice > salePrice && (
                            <p className="text-xl md:text-2xl font-bold text-gray-500 mb-2 line-through">₹{originalPrice}0</p>
                                        )}
                                        
                                        {/* Sale Price */}
                                        <p className="text-2xl md:text-3xl font-bold text-orange-500 mb-4">₹{salePrice}0</p>
                                </div>
                                
                                <button
                                    className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-orange-600 transition"
                                    onClick={() => handleCardClick(_id)}
                                >
                                    SHOP NOW
                                </button>
                            </div>

                            <div className="mt-8 lg:mt-0 w-[10rem] h-[14rem] relative">
                                <img
                                    src={featuredImage}
                                    alt="Product Image"
                                    className="w-[20rem] h-full object-cover rounded-3xl shadow-md"
                                />
                            </div>
                        </div>

                        {productHighlights && productHighlights.length > 0 ? (
                            <div className="flex-col md:flex mx-10 gap-6 mt-10">
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
                            <p>No highlights available</p>
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
