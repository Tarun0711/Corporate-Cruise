import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import heroimage from '../../../assets/hero/car_3-removebg.png'

const AboutPreview = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.25,
    triggerOnce: true,
    rootMargin: "-20px"
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.5,
        ease: "easeOut",
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const text = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      },
    },
  };

  const letter = {
    hidden: { 
      opacity: 0,
      y: 50 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
  };

  return (
    <section className="relative py-8 md:py-24 overflow-hidden bg-dot-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/50 to-blue-50/50"></div>
      
      <div className="absolute inset-0">
        <div className="absolute h-full w-full bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 order-2 lg:order-1 relative h-[300px] lg:h-[600px] p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-blue-100/30 rounded-3xl"></div>
              <motion.img
                src={heroimage}
                alt="Corporate employees commuting together"
                className="w-full h-full object-contain relative z-10"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/10 blur-xl rounded-full"></div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-7 order-1 lg:order-2 p-8 lg:p-12"
            >
              <div className="space-y-8">
                <motion.div 
                  variants={text}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center"
                >
                  <motion.span className="flex">
                    {"ABOUT".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        variants={letter}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                  <motion.span className="flex ml-2">
                    {"US".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        variants={letter}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-700 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl font-medium"
                >
                  Welcome to Corporate Cruise! We revolutionise corporate commuting with 
                  a reliable, efficient, and comfortable cab service tailored specifically 
                  for corporate employees. Join us in transforming your employee's commute 
                  experience, keeping them happy and on time, every time.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="inline-block"
                >
                  <Link
                    to="/about"
                    className="group relative inline-flex items-center px-10 py-5 overflow-hidden text-white bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-lg font-semibold"
                  >
                    <span className="absolute left-0 w-0 h-full bg-white/20 transform skew-x-12 group-hover:w-full transition-all duration-500 ease-out"></span>
                    <span className="relative flex items-center">
                      Discover Our Story
                      <svg className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutPreview;