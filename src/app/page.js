import Banner1 from "@/components/frontend/ui/(Banners)/Banner1";
import Banner2 from "@/components/frontend/ui/(Banners)/Banner2";
import BannerText01 from "@/components/frontend/ui/(Banners)/BannerText01";
import BannerText02 from "@/components/frontend/ui/(Banners)/BannerText02";
import CTA from "@/components/frontend/ui/CTA";
import HeroSection from "@/components/frontend/ui/HeroSection";
import Marquee from "@/components/frontend/ui/Marquee";
import ProductCard from "@/components/frontend/ui/ProductForSale";
import ProductIngredients from "@/components/frontend/ui/ProductIngredients";
import WhoWeAre from "@/components/frontend/ui/WhoWeAre";
import WhyChooseBrainbite from "@/components/frontend/ui/WhyChooseBrainbite";
import FeatureHighlights from "@/components/frontend/ui/FeatureHighlights";
import StaticPlayer from "@/components/frontend/ui/StaticPlayer";
import ProductFeatures from "@/components/frontend/ui/ProductFeatures";
import SmartIQGrid from "@/components/frontend/ui/SmartIQGrid";

export default function Home() {
  return (
    <>
    <HeroSection/>
    <FeatureHighlights/>
    <WhoWeAre/>
    <SmartIQGrid/>
    <ProductFeatures/>
    <ProductCard/>
    <Marquee/>
    <Banner1/>
    <BannerText01/>
    <BannerText02/>
    <StaticPlayer/>
    <ProductIngredients/>
    <WhyChooseBrainbite/>
    <CTA/>
    </>
  );
}
