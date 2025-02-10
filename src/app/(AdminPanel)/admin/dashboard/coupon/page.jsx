"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const AddCouponForm = () => {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    validFrom: "",
    validUntil: "",
    usageLimit: null,
    isActive: true,
    applicableProducts: [],
    applicableCategories: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Show loading toast
    toast.loading("Creating coupon...");
  
    try {
      const response = await fetch("/api/admin/dashboard/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create coupon");
      }
  
      const data = await response.json();
  
      // Dismiss loading toast and show success toast
      toast.dismiss();
      toast.success("Coupon created successfully!");
  
      console.log("Coupon created:", data);
    } catch (error) {
      // Dismiss loading toast and show error toast
      toast.dismiss();
      toast.error("Failed to create coupon");
  
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full p-4 bg-white shadow-lg h-[80vh] min-w-[100%] mx-auto mt-4 overflow-x-auto overflow-y-auto max-h-[75vh] custom-scrollbar">
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Coupon Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
  
      {/* Discount Type and Discount Value in a row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount Type</label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount Value</label>
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
  
      {/* Minimum Purchase Amount and Maximum Discount Amount in a row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Purchase Amount</label>
          <input
            type="number"
            name="minPurchaseAmount"
            value={formData.minPurchaseAmount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Discount Amount</label>
          <input
            type="number"
            name="maxDiscountAmount"
            value={formData.maxDiscountAmount || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
  
      {/* Validity Period */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Valid From</label>
          <input
            type="date"
            name="validFrom"
            value={formData.validFrom}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Valid Until</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
  
      {/* Usage Limit and Is Active in a row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
      </div>
  
      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-[20%] bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Coupon
        </button>
      </div>
    </form>
  </div>
  );
};

export default AddCouponForm;