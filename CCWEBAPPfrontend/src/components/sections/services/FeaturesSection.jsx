import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Clock, Shield, MapPin, Gift, Car, Check } from 'lucide-react';
import PropTypes from 'prop-types';

const features = [
  {
    title: "Always On Time, Every Time",
    description: "*Backup Drivers* Ensuring *Uninterrupted Service* - *99.8%* on-time arrival record",
    size: "md",
    icon: Car,
    delay: 0.1
  },
  {
    title: "Commute to office daily at very low prices",
    description: "*Fixed pricing* with *no surge charges* - Save up to *40%* on daily commutes",
    size: "md",
    icon: MapPin,
    delay: 0.2
  },
  {
    title: "Earn through Referral",
    description: "Get *75 Kms ride free* for every successful referral - *Unlimited earning potential* for both employees and drivers",
    size: "sm",
    icon: Gift,
    delay: 0.3
  },
  {
    title: "24/7 Service",
    description: "*24/7 availability* with live tracking",
    size: "sm",
    icon: Clock,
    isLive: true,
    delay: 0.4
  },
  {
    title: "Tailored Just for You: Enjoy Our Exclusive Monthly Packages",
    description: "*Personalized Plans* to Fit Every Passenger's *Unique Needs*",
    region: "Delhi NCR",
    size: "lg",
    icon: Check,
    delay: 0.5
  },
  {
    title: "Experience True Convenience",
    description: "*Reliable Door-to-Door* Pickup and Drop-Off Ensuring a *Seamless Commute* Every Time",
    size: "sm",
    icon: Car,
    delay: 0.6
  },
  {
    title: "Ride with Confidence",
    description: "Our Cabs Ensure *Ultimate Safety* and *Security for Women* - *Female drivers* available on request",
    size: "sm",
    icon: Shield,
    delay: 0.7
  }
];

const gridSizeClasses = {
  sm: "col-span-1 row-span-1",
  md: "col-span-1 row-span-2",
  lg: "col-span-2 row-span-2"
};

const FeatureCard = ({ feature }) => {
  const [isHovered, setIsHovered] = useState(false);

  const highlightText = (text) => {
    return text.split(/(\*[^*]+\*)/g).map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <span 
            key={index} 
            className="text-[#1791c8] font-medium"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  const Icon = feature.icon;

  return (
    <motion.div
      className={`relative ${gridSizeClasses[feature.size]} group`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: feature.delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 rounded-xl bg-gray-800/100 backdrop-blur-lg border border-gray-600/20 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-br from-[#1791c8]/20 to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="relative h-full p-4 flex flex-col justify-center items-center text-center">
        {feature.isLive ? (
          <div className="relative h-full w-full overflow-hidden rounded-xl">
            <video 
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-90"
            >
              <source src={feature.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <motion.div 
                    className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 to-[#1791c8] bg-clip-text text-transparent"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      textShadow: [
                        "0 0 10px rgba(34,211,238,0)",
                        "0 0 20px rgba(34,211,238,0.3)",
                        "0 0 10px rgba(34,211,238,0)"
                      ]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    24/7
                  </motion.div>
                </div>
                <p className="text-gray-200 text-sm md:text-base max-w-[200px] mx-auto">
                  {highlightText(feature.description)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              className="w-10 h-10 rounded-lg bg-[#1791c8]/20 flex items-center justify-center mb-3"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-5 h-5 text-[#1791c8]" />
            </motion.div>

            <h3 className="text-lg font-semibold text-gray-100 mb-2 px-2">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm leading-tight px-2">
              {highlightText(feature.description)}
            </p>

            {feature.region && (
              <div className="mt-3 pt-2 border-t border-gray-600/20 w-full">
                <span className="text-[#1791c8] text-xs font-medium">
                  Currently serving • {feature.region}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

FeatureCard.propTypes = {
  feature: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']).isRequired,
    region: PropTypes.string,
    type: PropTypes.string,
    video: PropTypes.string
  }).isRequired
};

const CabServiceGrid = () => {
  return (
    <div className="min-h-fit bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-20 ">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-100 mb-8"
        >
          Why Choose <span className="text-[#1791c8]">Our Service</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[minmax(150px,auto)]">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CabServiceGrid;