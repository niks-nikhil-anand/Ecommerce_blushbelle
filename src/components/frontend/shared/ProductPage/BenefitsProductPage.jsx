import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const BenefitsProductPage = () => {
  const [benefitData, setBenefitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchBenefitData = async () => {
      try {
        setLoading(true);
        const urlPath = window.location.pathname;
        const id = urlPath.substring(urlPath.lastIndexOf('/') + 1);
        const response = await fetch(`/api/admin/dashboard/benefits/product/${id}`);
        const data = await response.json();
        console.log(data[0])
        
        setBenefitData(data[0]);
      } catch (err) {
        setError('Failed to load benefit data');
      } finally {
        setLoading(false);
      }
    };

    fetchBenefitData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading benefits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center text-red-600">
          <p className="text-lg sm:text-xl font-semibold mb-2">Error</p>
          <p className="text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  // Only render if benefit data is available and has items
  if (!benefitData || !benefitData.items || benefitData.items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-2">
            Benefits of Our Product
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center">
          {/* Featured Image Section */}
          <div className="flex justify-center lg:justify-start order-1 lg:order-1">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none">
              <Image 
                src={benefitData?.image} 
                alt="Product Benefits" 
                width={300}
                height={250}
                className="w-full sm:w-80 lg:w-72 h-auto rounded-2xl shadow-2xl object-cover mx-auto lg:mx-0"
              />
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-2">
            {benefitData?.items.map((item, index) => (
              <div key={item._id} className="flex items-start space-x-3 sm:space-x-4">
                {/* Green dot connector with dotted line - Hidden on mobile for cleaner look */}
                <div className="hidden sm:flex flex-col items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  {index < benefitData.items.length - 1 && (
                    <div className="w-0.5 h-12 sm:h-16 border-l-2 border-dotted border-[#772336] mt-2"></div>
                  )}
                </div>

                {/* Mobile dot indicator */}
                <div className="sm:hidden flex flex-col items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                </div>

                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Image 
                    src={item.icon} 
                    alt={item.title}
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-lg sm:text-xl hidden">✨</span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsProductPage;