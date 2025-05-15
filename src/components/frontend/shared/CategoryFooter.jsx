"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/dashboard/category");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        // Take only up to 5 categories
        setCategories(data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Skeleton loader component for category list
  const CategorySkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
        <li key={item} className="flex items-center animate-pulse py-1">
          <div className="h-4 bg-gray-600 rounded w-32"></div>
          <div className="h-3 w-3 bg-gray-600 rounded-full ml-1"></div>
        </li>
      ))}
    </>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-2 pb-2">Categories</h3>
      <Separator className="bg-gray-600 mb-4" />

      {error ? (
        <p className="text-red-400 text-sm">
          Failed to load categories: {error}
        </p>
      ) : (
        <ul className="text-sm space-y-2 text-gray-400">
          {loading ? (
            <CategorySkeleton />
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <li
                key={index}
                className="flex items-center hover:text-gray-200 cursor-pointer"
              >
                
                <Link
                  href={`/category/${category.name.replace(/\s+/g, "-")}`}
                  className="flex items-center hover:text-gray-200 w-full"
                >
                  <span>{category.name}</span>
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No categories found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CategorySection;
