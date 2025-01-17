import Banner1 from "@/components/frontend/ui/(Banners)/Banner1";
import Banner2 from "@/components/frontend/ui/(Banners)/Banner2";
import BannerText01 from "@/components/frontend/ui/(Banners)/BannerText01";
import BannerText02 from "@/components/frontend/ui/(Banners)/BannerText02";
import CategoriesSection from "@/components/frontend/ui/CategorySection";
import CTA from "@/components/frontend/ui/CTA";
import HeroSection from "@/components/frontend/ui/HeroSection";
import Marquee from "@/components/frontend/ui/Marquee";
import ProductCard from "@/components/frontend/ui/ProductForSale";
import ProductIngredients from "@/components/frontend/ui/ProductIngredients";
import WhoWeAre from "@/components/frontend/ui/WhoWeAre";

export default function Home() {
  return (
    <>
    <HeroSection/>
    <WhoWeAre/>
    {/* <GoodnessSection/> */}
    <ProductCard/>
    {/* <ProductComponent/> */}
    {/* <CategoriesSection/> */}
    <Marquee/>
    <Banner1/>
    <BannerText01/>
    <BannerText02/>
    <ProductIngredients/>
    <Banner2/>
    <CTA/>
    </>
  );
}
