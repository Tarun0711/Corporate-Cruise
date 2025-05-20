import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiDollarSign, FiUser, FiClock, FiShield } from 'react-icons/fi';

const WhyChooseUs = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const benefits = [
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "Cost-Effective Solutions",
      description: "Affordable corporate packages and no surge pricing, saving money.",
      image: "/about/adv1.png"
    },
    {
      icon: <FiUser className="w-8 h-8" />,
      title: "Personalized Experience",
      description: "Private rides, ensuring privacy and personal space.",
      image: "/about/adv2.png"
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "Guaranteed Availability",
      description: "Always available, even during peak hours, ensuring timely pickups.",
      image: "/about/adv3.png"
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Comfortable Commutes",
      description: "Spacious and comfortable vehicles, avoiding the overcrowded metro experience.",
      image: "/about/adv4.png"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose Corporate-Cruise for unmatched corporate transportation. Experience reliable, safe, and luxurious travel with personalized solutions tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1791c8]">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                </div>
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;