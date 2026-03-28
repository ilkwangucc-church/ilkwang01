import HeroSection from "@/components/home/HeroSection";
import LatestSermon from "@/components/home/LatestSermon";
import WorshipSchedule from "@/components/home/WorshipSchedule";
import AboutSection from "@/components/home/AboutSection";
import ValuesSection from "@/components/home/ValuesSection";
import BlogPreview from "@/components/home/BlogPreview";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestSermon />
      <WorshipSchedule />
      <AboutSection />
      <ValuesSection />
      <BlogPreview />
      <ContactCTA />
    </>
  );
}
