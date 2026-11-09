import HeroSection from "@/components/sections/HeroSection";
import TrendingGames from "@/components/sections/TrendingGames";
import CategoriesSection from "@/components/sections/CategoriesSection";
import UpcomingSection from "@/components/sections/UpcomingSection";
import DealsSection from "@/components/sections/DealsSection";
import HowItWorks from "@/components/sections/HowItWorks";
import ReviewsSection from "@/components/sections/ReviewsSection";
import NewsletterCTA from "@/components/sections/NewsletterCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrendingGames />
      <CategoriesSection />
      <UpcomingSection />
      <DealsSection />
      <HowItWorks />
      <ReviewsSection />
      <NewsletterCTA />
    </>
  );
}
