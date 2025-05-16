import CategoriesSection from "@/components/frontend/ui/CategorySection";
import FeatureHighlights from "@/components/frontend/ui/FeatureHighlights";
import GenuisKidGrid from "@/components/frontend/ui/GenuisKidGrid";
import HeroSection from "@/components/frontend/ui/HeroSection";
import ProductFeatures from "@/components/frontend/ui/ProductFeatures";
import ProductIngredients from "@/components/frontend/ui/ProductIngredients";
import SmartIQGrid from "@/components/frontend/ui/SmartIQGrid";
import StaticPlayer from "@/components/frontend/ui/StaticPlayer";
import WhyChooseBrainbite from "@/components/frontend/ui/WhyChooseBrainbite";
import ProductForSaleUser from "@/components/users/ui/ProductForSaleUser";
import React from "react";

const page = () => {
  return (
    <div>
      <HeroSection />
      <FeatureHighlights />
      <CategoriesSection />
      <ProductForSaleUser />
      <ProductFeatures />
      <GenuisKidGrid />
      <SmartIQGrid />
      <StaticPlayer />
      <ProductIngredients />
      <WhyChooseBrainbite />
    </div>
  );
};

export default page;
