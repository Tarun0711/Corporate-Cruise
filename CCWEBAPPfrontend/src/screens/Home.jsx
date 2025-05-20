import { motion } from 'framer-motion';
import Hero from '../components/sections/home/Hero';
import AboutPreview from '../components/sections/home/AboutPreview';
import HowWeWork from '../components/sections/home/HowWeWork';
import B2BServices from '../components/sections/home/B2BServices';
import Comparison from '../components/sections/home/Comparison';
import PricingSection from '../components/sections/home/PricingSection';
import Footer from '../components/Footer';

function Home() {

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <AboutPreview />
      <Comparison />
      <HowWeWork />
      <PricingSection />
      <B2BServices />
      <Footer />
    </motion.div>
  )
}

export default Home
