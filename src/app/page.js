
import CTA from "@/components/frontend/ui/CTA";
import HeroSection from "@/components/frontend/ui/HeroSection";
import ProductIngredients from "@/components/frontend/ui/ProductIngredients";
import WhyChooseBrainbite from "@/components/frontend/ui/WhyChooseBrainbite";
import FeatureHighlights from "@/components/frontend/ui/FeatureHighlights";
import StaticPlayer from "@/components/frontend/ui/StaticPlayer";
import ProductFeatures from "@/components/frontend/ui/ProductFeatures";
import SmartIQGrid from "@/components/frontend/ui/SmartIQGrid";
import GenuisKidGrid from "@/components/frontend/ui/GenuisKidGrid";
import CategoriesSection from "@/components/frontend/ui/CategorySection";
import ProductCard from "@/components/frontend/ui/ProductForSale";

export default function Home() {
  return (
    <>
    <HeroSection/>
    <FeatureHighlights/>
    <CategoriesSection/>
    <ProductCard/>
    <ProductFeatures/>
    <SmartIQGrid/>
    <GenuisKidGrid/>
    <StaticPlayer/>
    <ProductIngredients/>
    <WhyChooseBrainbite/>
    <CTA/>
    </>
  );
}
