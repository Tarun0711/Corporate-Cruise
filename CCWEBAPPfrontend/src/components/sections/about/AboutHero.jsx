import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import About from '../../../assets/aboutus/imgonline-com-ua-ReplaceColor-3otGGNG2gLokrTK2.png';

const AboutHero = () => {
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
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={itemVariants} className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            We Build bridges between
              <span className="text-primary block mt-3">companies and employees</span>
            </h1>
            <div className="w-24 h-1.5 bg-primary mb-8"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Founded with a vision to revolutionize commuter convenience in Delhi NCR, Corporate Cruise embarked on its journey to provide reliable and efficient cab services that cater specifically to the needs of office employees.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={About}
                alt="Corporate Cruise Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;