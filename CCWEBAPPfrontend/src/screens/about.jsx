import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AboutHero from '../components/sections/about/AboutHero';
import MissionVision from '../components/sections/about/MissionVision';
import WhyChooseUs from '../components/sections/about/WhyChooseUs';
import ValuesShowcase from '../components/sections/about/ValuesShowcase';
import JoinFleetSection from '../components/sections/about/JoinFleetSection';
import CTA from '../components/sections/about/CTA';

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Navigation />
      <main className="pt-20">
        <AboutHero />
        <MissionVision />
        <WhyChooseUs />
        <JoinFleetSection />
        <ValuesShowcase />
        <CTA />
      </main>

      <Footer />
    </motion.div>
  );
}

export default About;