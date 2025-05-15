'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const ProductRoute = () => {
  const params = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

 useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.info("[Products Fetch] Starting fetch...");
        console.log(params)

        const category = params?.id;
        const subcategory = params?.subCategory;

        console.debug("[Params] Category:", category);
        console.debug("[Params] Subcategory:", subcategory);

        if (!category || !subcategory) {
          console.error("[Params] Missing category or subcategory.");
          return;
        }

        const apiUrl = `/api/category/${category}/products/${subcategory}`;
        console.info("[API Request] GET", apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          console.error("[API Response] Failed with status:", response.status);
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.info("[API Response] Fetched products:", data);

        setProducts(data);
      } catch (err) {
        console.error("[Fetch Error]", err.message);
        setError(err.message);
      } finally {
        console.info("[Products Fetch] Done.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params]);


  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading products...</div>
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {params.subcategory?.replace(/-/g, ' ')} Products
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "/api/placeholder/400/320";
            e.target.alt = "Product image placeholder";
          }}
        />
      )}
      
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(Math.floor(product.rating))].map((_, i) => (
                <span key={i}>★</span>
              ))}
              {[...Array(5 - Math.floor(product.rating))].map((_, i) => (
                <span key={i} className="text-gray-300">★</span>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviewCount || 0})</span>
          </div>
        )}
        
        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductRoute