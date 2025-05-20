import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const MissionVision = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12 items-stretch"
        >
          {/* Mission Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <h2 className="text-3xl font-bold mb-2">
              Our <span className="text-primary">Mission</span>
            </h2>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <p className="text-gray-600 text-lg leading-relaxed">
            "At Corporate-Cruise, our mission is to revolutionize corporate transportation by providing reliable, safe, and luxurious travel experiences. We aim to enhance the daily commutes of professionals with personalized solutions, ensuring convenience, comfort, and excellence every step of the way."
            </p>
          </motion.div>

          {/* Vision Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <h2 className="text-3xl font-bold mb-2">
              Our <span className="text-primary">Vision</span>
            </h2>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <p className="text-gray-600 text-lg leading-relaxed">
            "Our vision is to be the leading provider of corporate transportation services, known for our commitment to innovation, sustainability, and customer satisfaction. We strive to set the standard in the industry, making every journey seamless and enjoyable for our clients."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision; 