import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="relative py-20 bg-gradient-to-r from-primary to-blue-600 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/src/assets/patterns/wave.svg')]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Join 500+ companies who trust Corporate Cruise for their employee transportation
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/signup'}
            className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg
                     hover:bg-blue-50 transition-all duration-300 shadow-xl"
          >
            Pre-Register Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA; 