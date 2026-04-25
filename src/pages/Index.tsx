import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import WorkflowSection from "@/components/WorkflowSection";
import TerminalSection from "@/components/TerminalSection";
// import TestimonialsSection from "@/components/TestimonialsSection";
// import BlogSection from "@/components/BlogSection";
// import GitHubSection from "@/components/GitHubSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import AccentColorPicker from "@/components/AccentColorPicker";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SplashScreen isVisible={loading} />
      <div
        className={`min-h-screen bg-background text-foreground overflow-x-hidden transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
      >
        <Navbar />
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <ProjectsSection />
        <WorkflowSection />
        <TerminalSection />
        {/* <TestimonialsSection /> */}
        {/* <BlogSection /> */}
        {/* <GitHubSection /> */}
        <ContactSection />
        <Footer />
        <AccentColorPicker />
      </div>
    </>
  );
};

export default Index;
