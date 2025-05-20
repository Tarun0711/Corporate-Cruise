import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-r from-primary to-blue-600 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Subscribe to Our Services Now!
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Join hundreds of corporate professionals enjoying stress-free commutes
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/signup'}
            className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:bg-blue-50 transition-all"
          >
            Pre-Register Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
