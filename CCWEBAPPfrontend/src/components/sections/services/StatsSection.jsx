import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

const StatItem = ({ number, label }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev >= number) {
            clearInterval(interval);
            return number;
          }
          return prev + Math.ceil(number / 50);
        });
      }, 30);

      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 1.5, repeat: Infinity }
      });

      return () => clearInterval(interval);
    }
  }, [inView, number, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gray-100 rounded-[2.5rem] hover:shadow-3xl transition-all duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1791c820_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="relative text-center p-6">
        <motion.div
          animate={controls}
          className="text-6xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-4"
        >
          {count}+
        </motion.div>
        <div className="text-gray-900 text-lg font-bold tracking-wide">{label}</div>
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Floating Blobs */}
        

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          <StatItem number={840} label="Timely Rides" />
          <StatItem number={500} label="Trusted Drivers" />
          <StatItem number={2100} label="Happy Customers" />
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection; 