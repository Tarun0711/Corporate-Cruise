import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiLoader, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [phase, setPhase] = useState('initial');
  const [hoveredGrid, setHoveredGrid] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [inView, controls]);

  const handleMouseMove = (e) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  const startCalculation = async () => {
    setPhase('calculating');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPhase('result');
    await new Promise(resolve => setTimeout(resolve, 3000));
    setPhase('denied');
  };

  return (
    <section 
      className="relative py-28 overflow-hidden bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced grid background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="absolute inset-0 bg-[length:60px_60px] bg-[linear-gradient(to_right,#4f46e51f_1px,transparent_1px),linear-gradient(to_bottom,#4f46e51f_1px,transparent_1px)]"
          animate={{ 
            x: hoveredGrid ? [-40, 0, -40] : 0,
            y: hoveredGrid ? [40, 0, 40] : 0 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 bg-[length:80px_80px] bg-[linear-gradient(45deg,#4f46e51f_1px,transparent_1px)]"
          style={{ x: mx, y: my }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-400/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4f46e515_0%,transparent_70%)]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="space-y-8"
        >
          {phase === 'initial' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Your Monthly Commute Cost?
              </h2>
              <p className="text-gray-300 text-lg">
                Get personalized estimates based on your travel patterns
              </p>
            </motion.div>
          )}

          {phase === 'calculating' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="h-32 flex items-center justify-center">
                <motion.div 
                  className="text-3xl font-mono text-cyan-300 flex items-center gap-4"
                  animate={{ scale: [1, 1.05] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FiLoader className="animate-spin" />
                  <div className="text-left">
                    <div className="animate-pulse">Creating Your Plan...</div>
                    <div className="text-sm text-cyan-400/70 mt-1">
                      Analyzing 120+ commute variables
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.div
                className="h-1 bg-gray-700 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'linear' }}
              >
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400" />
              </motion.div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="h-32 relative">
                <motion.div
                  className="text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                >
                  <span className="animate-glitch">SAVE 47-62%</span>
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="md:text-3xl text-xl font-mono text-cyan-300 space-y-2">
                    <div className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-cyan-400 pr-2">
                      Optimized Plan: Corporate Cruise Economy
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-cyan-300">
                {['Time Saved: 18h/mo', 'Cost Reduction: ₹8,200', 'Smart Routing Savings:420 KM', 'Stress: ↓65%'].map((item, i) => (
                  <motion.div
                    key={i}
                    className="p-3 border border-cyan-400/30 rounded-lg backdrop-blur-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'denied' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="h-32 flex items-center justify-center relative">
                <div className="text-red-400 flex items-center gap-2 text-2xl">
                  <FiLock className="animate-bounce" />
                  <span className="font-mono">PLAN READY - ACCESS DENIED</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-4xl font-bold text-red-400/20"
                      animate={{ 
                        scale: [1, 1.2],
                        opacity: [0.3, 0] 
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3 
                      }}
                    >
                      PRE-REGISTER TO UNLOCK
                    </motion.div>
                  ))}
                </div>
              </div>
              <p className="text-gray-300">
                Your personalized commute blueprint is waiting!
              </p>
            </motion.div>
          )}

          <motion.div
            whileHover={phase === 'initial' ? { scale: 1.05 } : {}}
            whileTap={phase === 'initial' ? { scale: 0.95 } : {}}
            className="inline-block"
          >
            {phase === 'denied' ? (
              <Link
                to="/signup"
                className="group relative flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium overflow-hidden transition-all"
              >
                <span className="relative z-10 flex items-center">
                  Pre-register Now
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-noise opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-pink-400/30 animate-gradient-x" />
              </Link>
            ) : (
              <button
                onClick={startCalculation}
                disabled={phase !== 'initial'}
                className={`group relative flex items-center gap-2 ${
                  phase === 'initial' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer'
                    : 'bg-gray-700 cursor-not-allowed'
                } text-white px-8 py-4 rounded-full font-medium overflow-hidden transition-all`}
              >
                <span className="relative z-10 flex items-center">
                  {phase === 'initial' && 'Calculate My Savings'}
                  {phase === 'calculating' && 'Analyzing...'}
                  {phase === 'result' && 'Unlock Full Blueprint'}
                  {(phase === 'initial' || phase === 'result') && (
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  )}
                  {phase === 'calculating' && (
                    <FiLoader className="ml-2 animate-spin" />
                  )}
                </span>
                <div className="absolute inset-0 bg-noise opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 animate-gradient-x" />
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-400/20 font-bold text-xl"
            initial={{
              x: Math.random() * 100 - 50 + '%',
              y: Math.random() * 100 - 50 + '%',
              rotate: Math.random() * 360
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['₹', '₹', '★', '✧', '⬩'][i % 5]}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;