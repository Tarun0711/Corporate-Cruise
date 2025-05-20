import { motion } from 'framer-motion';
import { FiLinkedin, FiTwitter } from 'react-icons/fi';

const LeadershipTeam = () => {
  const team = [
    {
      name: 'Aarav Sharma',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in transport tech',
      image: '/src/assets/about/team1.jpg'
    },
    {
      name: 'Priya Patel',
      role: 'COO',
      bio: 'Operations expert scaling startups to enterprises',
      image: '/src/assets/about/team2.jpg'
    },
    {
      name: 'Rohan Singh',
      role: 'CTO',
      bio: 'Tech architect behind our smart mobility platform',
      image: '/src/assets/about/team3.jpg'
    },
    {
      name: 'Neha Gupta',
      role: 'CFO',
      bio: 'Financial strategist driving sustainable growth',
      image: '/src/assets/about/team4.jpg'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Leadership Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The driving force behind our success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-blue-200">{member.role}</p>
                </div>

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20">
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20">
                    <FiTwitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600 text-center px-4">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeam; 