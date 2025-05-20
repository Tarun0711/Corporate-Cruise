import { motion } from 'framer-motion';
import HeroSection from '../components/sections/services/HeroSection';
import StatsSection from '../components/sections/services/StatsSection';
import FeaturesSection from '../components/sections/services/FeaturesSection';
import DriveWithUs from '../components/sections/services/DriveWithUs';
import ScheduleMeetingSection from '../components/sections/services/ScheduleMeetingSection';
import CTASection from '../components/sections/services/CTASection';
import Footer from '../components/Footer';

function Service() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ScheduleMeetingSection />
      <DriveWithUs />
      <CTASection />
      <Footer />
    </motion.div>
  );
}

export default Service;