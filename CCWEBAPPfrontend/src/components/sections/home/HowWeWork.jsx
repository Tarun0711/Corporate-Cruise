import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const HowWeWork = () => {
  const steps = [
    {
      number: "01",
      title: "Website Form",
      description: "Let's get you started by filling up a small form in our website.",
      color: "bg-pink-100",
      iconBg: "bg-pink-200"
    },
    {
      number: "02",
      title: "Analyzing",
      description: "Now please allow us 1-2 working days to analyse and learn your requirement.",
      color: "bg-purple-100",
      iconBg: "bg-purple-200"
    },
    {
      number: "03",
      title: "Perfect Match",
      description: "Hurray! We found a perfect match for your desired ride preference, assigning you the ride now.",
      color: "bg-yellow-100",
      iconBg: "bg-yellow-200"
    },
    {
      number: "04",
      title: "Trip Details",
      description: "Hey, We have shared the trip and fare details, personalised just for you, please go through them.",
      color: "bg-blue-100",
      iconBg: "bg-blue-200"
    },
    {
      number: "05",
      title: "Make the Payment",
      description: "Let's get done with the process by making the payment now.",
      color: "bg-green-100",
      iconBg: "bg-green-200"
    },
    {
      number: "06",
      title: "Hurray!!",
      description: "Congratulations!! We hope to give you the best possible experience on board with us.",
      color: "bg-amber-100",
      iconBg: "bg-amber-200"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-bold text-gray-900 mb-4"
          >
            How we<br />work
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-7xl md:text-8xl font-bold text-[#1791c8] mb-4"
          >
            Specially<br />for you
          </motion.h1>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-200 transform -translate-x-1/2 z-0" />
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-center"
              >
                <div className={`w-[600px] ${index % 2 === 0 ? 'mr-8 ml-auto' : 'ml-8 mr-auto'}`}>
                  <div 
                    className={`relative rounded-3xl p-6 ${step.color} shadow-lg hover:shadow-xl 
                    transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-6xl font-light text-gray-300">
                        {step.number}
                      </span>
                      <div className={`${step.iconBg} p-2 rounded-lg`}>
                        <FaStar className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ 
                type: "spring",
                duration: 0.6,
                delay: index * 0.1,
                bounce: 0.4 
              }}
              className={`relative rounded-3xl p-6 ${step.color} shadow-lg hover:shadow-xl 
              transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl font-bold text-primary/30">
                  {step.number}
                </span>
                <div className={`${step.iconBg} p-2 rounded-lg`}>
                  <FaStar className="text-white w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-700 font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork; 