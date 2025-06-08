import CTA from "@/components/frontend/ui/CTA";
import HeroSection from "@/components/frontend/ui/HeroSection";
import ProductIngredients from "@/components/frontend/ui/ProductIngredients";
import WhyChooseBrainbite from "@/components/frontend/ui/WhyChooseBrainbite";
import FeatureHighlights from "@/components/frontend/ui/FeatureHighlights";
import StaticPlayer from "@/components/frontend/ui/StaticPlayer";
import ProductFeatures from "@/components/frontend/ui/ProductFeatures";
import CategoriesSection from "@/components/frontend/ui/CategorySection";
import FeaturedProductSection from "@/components/frontend/ui/ProductForSale";
import HomePageProductGrid from "@/components/frontend/ui/HomePageProductGrid";

export default function Home() {
  return (
    <>
    <HeroSection/>
    <FeatureHighlights/>
    <CategoriesSection/>
    <FeaturedProductSection/>
    <ProductFeatures/>
    <HomePageProductGrid/>
    <StaticPlayer/>
    <ProductIngredients/>
    <WhyChooseBrainbite/>
    <CTA/>
    </>
  );
}



