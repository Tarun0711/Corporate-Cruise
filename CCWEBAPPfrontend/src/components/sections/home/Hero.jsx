import { motion, useScroll } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import heroImage from '../../../assets/hero/hero.png';

const Hero = () => {
  const [showScroll, setShowScroll] = useState(true);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      // Hide scroll indicator after 100px of scrolling
      setShowScroll(latest < 100);
    });

    return () => unsubscribe();
  }, [scrollY]);

  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative mt- min-h-[80vh] md:min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden px-4 sm:px-6 pt-24">
      {/* Background animated shapes - adjusted for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -right-10 sm:-top-40 sm:-right-40 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-blue-100 mix-blend-multiply blur-xl opacity-60"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 sm:-bottom-40 sm:-left-40 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-purple-100 mix-blend-multiply blur-xl opacity-60"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:grid lg:grid-cols-2 gap-2 md:gap-8 items-center"
        >
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight"
            >
              Join The{' '}
              <span className="text-primary inline-block">Corporate</span>
              <br />
              Cruise
            </motion.h1>
            <motion.h2 
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 leading-tight"
            >
              <span className="inline-block">
                COMMUTE TOGETHER
              </span>
              <br />
              <span className="inline-block text-primary">
                SUCCEED TOGETHER
              </span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
            >
              Say goodbye to commute chaos and hello to smooth,
              shared rides. We provide tailored transport services to
              keep your employees happy and on time.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-row sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/signup"
                className="btn-primary text-base sm:text-lg whitespace-nowrap font-bold"
              >
                Pre-Register Now
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative w-full flex justify-center lg:justify-start max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-3xl mx-auto mt-4 lg:mt-0"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <img
            src={heroImage}
              alt="Hero Illustration"
              className="w-full h-auto lg:scale-110 object-contain"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:flex flex-col items-center"
        animate={{
          y: [0, 10, 0],
          opacity: showScroll ? [0.6, 1, 0.6] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={() => window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        })}
      >
        <div className="text-gray-600 text-sm mb-2">Scroll Down</div>
        <svg 
          className="w-6 h-6 text-primary animate-bounce" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;