"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBolt, FaBrain, FaLeaf } from "react-icons/fa"; // Example icons

const ProductComponent = () => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/admin/dashboard/product/addProduct")
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error fetching the product data!", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center bg-[#FFF6E6] py-12 px-6"  key={_id}
         onClick={() => handleCardClick(_id)}
         >
            <div className="max-w-4xl flex flex-col lg:flex-row items-center justify-between">
                <div className="text-left">
                    <h1 className="text-3xl font-bold mb-4">THINK CLEARER</h1>
                    <p className="text-gray-700 mb-4">
                        India’s Most Clinically Advanced Formulation & Recommended by Globally Renowned “Biohacking” Experts.
                    </p>
                    <p className="text-2xl font-bold mb-4">₹{salePrice}0</p>
                    <button className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-orange-600"
                   onClick={() => handleCardClick(_id)} 
                    >
                        SHOP NOW
                    </button>
                </div>
                <div className="mt-8 lg:mt-0">
                    <img
                         src={featuredImage}
                        alt="Product Image"
                        className="w-48 h-48 object-contain bg-orange-300 p-6 rounded-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="text-center p-4 bg-white rounded-lg shadow-md">
                    <FaBolt className="text-orange-500 text-3xl mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{truncateText(name, 10)}</h3>
                    <p className="text-gray-600">
                        Brings all your attention to the activity you are doing while effectively clearing out any distractions.
                    </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-md">
                    <FaBrain className="text-orange-500 text-3xl mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Enhance Memory</h3>
                    <p className="text-gray-600">
                        Improve your capacity to learn and retain more information and fasten recalling ability.
                    </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-md">
                    <FaLeaf className="text-orange-500 text-3xl mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Fortify Brain Health</h3>
                    <p className="text-gray-600">
                        Advance combination of 10+ nootropics, minerals, vitamins and amino acids fuels and improves brain health.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductComponent;
