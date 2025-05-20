import { motion } from 'framer-motion';

const ValuesShowcase = () => {
  const values = [
    {
      title: "Safety First",
      description: "Rigorous driver verification and real-time tracking",
      icon: "🛡️"
    },
    {
      title: "Eco-Friendly",
      description: "Reducing carbon footprint through ride sharing",
      icon: "🌱"
    },
    {
      title: "Affordability",
      description: "Affordable corporate commuting without compromise.",
      icon: "💰"
    },
    {
      title: "Tech Driven",
      description: "Smart routing using advanced algorithms",
      icon: "💻"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The principles that drive every decision we make
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesShowcase; 