import { motion } from 'framer-motion';
import drive from '../../../assets/services/s5.png';  
const DriveWithUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src={drive}
              alt="Happy Driver"
              className="rounded-2xl shadow-xl md:w-3/4"
            />
          </motion.div>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Drive With Us & Earn a Stable Income
            </h2>
            <ul className="text-lg text-gray-600 space-y-4 mb-8">
              <li>✅ Better pay than competitors</li>
              <li>✅ Flexible working hours</li>
              <li>✅ Performance bonuses</li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSeFmOPFOnyd9jyZWFe05Bowjw43SHmdLWKEhYHgyOlTOPXwLA/viewform?usp=sf_link'}
              className="bg-primary text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Driving Today
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DriveWithUs; 