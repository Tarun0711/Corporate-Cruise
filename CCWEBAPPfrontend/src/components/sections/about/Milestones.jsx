import { motion } from 'framer-motion';
import { FiFlag, FiUsers, FiMap, FiAward } from 'react-icons/fi';

const Milestones = () => {
  const milestones = [
    {
      year: '2018',
      title: 'Founded in Noida',
      icon: <FiFlag className="w-6 h-6" />,
      description: 'Started with 10 employees and 5 corporate clients'
    },
    {
      year: '2019',
      title: 'First 1000 Users',
      icon: <FiUsers className="w-6 h-6" />,
      description: 'Reached major adoption in Delhi NCR region'
    },
    {
      year: '2020',
      title: 'Pan-India Expansion',
      icon: <FiMap className="w-6 h-6" />,
      description: 'Launched services in 8 major Indian cities'
    },
    {
      year: '2023',
      title: 'Industry Recognition',
      icon: <FiAward className="w-6 h-6" />,
      description: 'Awarded Best Corporate Mobility Startup'
    }
  ];

  return (
    <section className="py-20 bg-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Key milestones in our growth story
          </p>
        </div>

        <div className="relative pl-8 sm:pl-24 lg:pl-48">
          <div className="absolute left-0 sm:left-20 lg:left-44 w-1 h-full bg-gradient-to-b from-primary to-blue-200"></div>
          
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15 }}
              className="relative mb-16 last:mb-0"
            >
              <div className="absolute -left-11 top-5 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                {milestone.icon}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-primary font-bold text-xl">
                    {milestone.year}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {milestone.title}
                  </h3>
                </div>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Milestones; 