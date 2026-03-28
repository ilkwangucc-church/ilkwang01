import HeroSection from "@/components/home/HeroSection";
import LatestSermon from "@/components/home/LatestSermon";
import WorshipSchedule from "@/components/home/WorshipSchedule";
import BlogPreview from "@/components/home/BlogPreview";
import EventsSection from "@/components/home/EventsSection";
import AboutSection from "@/components/home/AboutSection";
import ValuesSection from "@/components/home/ValuesSection";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestSermon />
      <WorshipSchedule />
      <BlogPreview />
      <EventsSection />
      <AboutSection />
      <ValuesSection />
      <ContactCTA />
    </>
  );
}
