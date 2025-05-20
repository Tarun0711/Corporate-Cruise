import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import service from "../../../assets/services/file.png";

const HeroSection = () => {
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
    <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-blue-50 to-white pt-5 md:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-2 items-center"
        >
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6 mt-3">
              Revolutionizing{' '}
              <br />
              <span className="text-gray-900 text-3xl sm:text-4xl md:text-5xl">
              and making commute an ease for corporate professionals
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
            Our mission is to provide a safe, reliable and affordable commute for corporate professionals.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Pre-Register Now
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src={service}
              alt="Corporate Commute"
              className="w-full h-auto max-w-2xl mx-auto scale-110"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 