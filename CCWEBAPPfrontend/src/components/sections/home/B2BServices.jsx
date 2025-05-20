import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShield, FiDollarSign, FiClock, FiUsers, FiTrendingUp, FiAward, FiStar } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/effect-cards';

// Import images
import dis1 from '/src/assets/comparison/disadvantages/dis1.png';
import adv1 from '/src/assets/comparison/advantages/adv1.png';
import missedMeeting from '/src/assets/comparison/disadvantages/dis2.jpeg';
import guaranteed from '/src/assets/comparison/advantages/adv2.png';
import expensive from '/src/assets/comparison/disadvantages/dis3.png';
import affordable from '/src/assets/comparison/advantages/adv3.png';
import unreliable from '/src/assets/comparison/disadvantages/dis4.png';
import verified from '/src/assets/comparison/advantages/adv4.png';

const B2BServices = () => {
  const benefits = [
    {
      icon: <FiDollarSign className="text-2xl" />,
      title: "Cost Optimization",
      description: "Reduce transportation costs by up to 40% through efficient route planning and ride sharing",
      color: "blue"
    },
    {
      icon: <FiUsers className="text-2xl" />,
      title: "Employee Satisfaction",
      description: "Boost retention with comfortable, reliable, and stress-free commuting options",
      color: "green"
    },
    {
      icon: <FiClock className="text-2xl" />,
      title: "Time Management",
      description: "Optimize pickup schedules and routes to ensure punctual arrivals",
      color: "purple"
    },
    {
      icon: <FiShield className="text-2xl" />,
      title: "Safety & Security",
      description: "Verified drivers, real-time tracking, and 24/7 support for peace of mind",
      color: "red"
    },
    {
      icon: <FiTrendingUp className="text-2xl" />,
      title: "Analytics & Reporting",
      description: "Comprehensive dashboards for tracking usage, costs, and optimization opportunities",
      color: "indigo"
    },
    {
      icon: <FiAward className="text-2xl" />,
      title: "Premium Service",
      description: "Dedicated account managers and priority support for corporate clients",
      color: "yellow"
    }
  ];

  const comparisonPairs = [
    {
      problem: {
        icon: dis1,
        title: 'Late Pickups',
        description: 'Constant delays and unreliable pickup times affecting your schedule',
        color: 'red'
      },
      solution: {
        icon: adv1,
        title: 'Always On Time',
        description: 'Guaranteed punctual pickups with real-time tracking',
        color: 'green'
      }
    },
    {
      problem: {
        icon: missedMeeting,
        title: 'Missed Meetings',
        description: 'Important meetings delayed due to transportation issues',
        color: 'red'
      },
      solution: {
        icon: guaranteed,
        title: 'Guaranteed Arrivals',
        description: 'Schedule ahead with confidence for important appointments',
        color: 'green'
      }
    },
    {
      problem: {
        icon: expensive,
        title: 'Expensive Commute',
        description: 'Unpredictable surge pricing and high daily costs',
        color: 'red'
      },
      solution: {
        icon: affordable,
        title: 'Affordable Rides',
        description: 'Fixed corporate rates with significant cost savings',
        color: 'green'
      }
    },
    {
      problem: {
        icon: unreliable,
        title: 'Unreliable Drivers',
        description: 'Inconsistent service quality and unprofessional behavior',
        color: 'red'
      },
      solution: {
        icon: verified,
        title: 'Verified Professionals',
        description: 'Thoroughly vetted drivers with top ratings',
        color: 'green'
      }
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      purple: "bg-purple-50 text-purple-600",
      red: "bg-red-50 text-red-600",
      indigo: "bg-indigo-50 text-indigo-600",
      yellow: "bg-yellow-50 text-yellow-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Benefits</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Enterprise Transportation Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transform your corporate commute program with our comprehensive solutions designed 
            to enhance employee satisfaction while reducing operational costs.
          </p>
        </motion.div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`mb-4 p-3 rounded-lg inline-block ${getColorClasses(benefit.color)}`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4">
            <span className="text-primary">Corporate </span>Cruise 
            <br />
            Difference
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how we transform your daily commute experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {comparisonPairs.map((pair, index) => (
            <div key={`pair-${index}`} className="contents lg:block">
              {/* Challenge Card */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: index * 0.2, type: "spring" }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow md:mb-10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                    <img 
                      src={pair.problem.icon} 
                      alt={pair.problem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className={`${getColorClasses(pair.problem.color)} px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block`}>
                      Challenge
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pair.problem.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {pair.problem.description}
                    </p>
                  </div>
                </div>
              </motion.div>
              {/* <br /> */}
              {/* Solution Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: index * 0.2 + 0.1, type: "spring" }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-green-100 lg:-mt-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                    <img 
                      src={pair.solution.icon} 
                      alt={pair.solution.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className={`${getColorClasses(pair.solution.color)} px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block`}>
                      Solution
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pair.solution.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {pair.solution.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Commute?
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of happy commuters who've made the switch to Corporate Cruise.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/signup"
                className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-lg font-medium 
                         transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FiStar className="mr-2" />
                Pre-Register Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default B2BServices; 