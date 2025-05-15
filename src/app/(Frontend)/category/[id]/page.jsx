"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

// This will be our dynamic category page component showing subcategories
const CategoryPage = () => {
  const router = useRouter();
  const params = useParams(); 
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Make sure params exist before proceeding
        if (!params || !params.id) {
          console.error("Missing slug parameter", params);
          setLoading(false);
          return;
        }

        // Format the slug back to a proper name format for API query
        // Convert hyphens to spaces and capitalize each word
        const categoryName = params?.id
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        console.log(categoryName);

        // Fetch category and its subcategories using the API endpoint
        const response = await axios.get(`/api/categories/${encodeURIComponent(categoryName)}`);
        
        if (response.data) {
          setCategory(response.data.category);
          if (
            response.data.subcategories &&
            Array.isArray(response.data.subcategories)
          ) {
            setSubcategories(response.data.subcategories);
          }
        } else {
          console.error("Category not found");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [params]);

  // Go back to previous page
  const handleGoBack = () => {
    router.back();
  };

  // Navigate to subcategory
  const handleSubcategoryClick = (subcategory) => {
    // Create slug from subcategory name
    const subcategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/category/${params.id}/subcategory/${subcategorySlug}`);
  };

  // Prepare skeleton or actual content cards
  const displayedSubcategories = loading ? Array(8).fill({}) : subcategories;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 flex items-center"
        onClick={handleGoBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Category Header */}
      <div className="flex items-center mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {loading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold">{category?.name || "Category"}</h1>
          )}
        </div>
      </div>

      {/* Subcategories Grid */}
      {!loading && subcategories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            No subcategories found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {displayedSubcategories.map((subcategory, index) => (
            <motion.div
              key={loading ? `skeleton-${index}` : subcategory._id}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              className={`h-full ${!loading && 'cursor-pointer'}`}
              onClick={() => !loading && handleSubcategoryClick(subcategory)}
            >
              <Card className={`flex flex-col items-center p-4 hover:shadow-lg transition-all duration-300 ${!loading && 'cursor-pointer'}`}>
                {loading ? (
                  <>
                    <Skeleton className="rounded-full w-20 h-20 sm:w-24 sm:h-24 mb-3" />
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </>
                ) : (
                  <>
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 rounded-full overflow-hidden">
                      <Image
                        src={subcategory.image || "/frontend/others/placeholder.png"}
                        alt={subcategory.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-center">
                      {subcategory.name}
                    </h3>
                  </>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;