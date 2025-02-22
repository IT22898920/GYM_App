import { useState, useEffect } from 'react';
import { FiAward, FiUsers, FiHeart, FiTarget, FiTrendingUp, FiSmile, FiCheck, FiGlobe, FiClock, FiActivity } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

function About() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: teamRef, inView: teamInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: valuesRef, inView: valuesInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: timelineRef, inView: timelineInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    { number: "10+", label: "Years Experience", icon: FiAward },
    { number: "5000+", label: "Happy Members", icon: FiUsers },
    { number: "100+", label: "Expert Trainers", icon: FiHeart },
    { number: "50+", label: "Locations", icon: FiTarget }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      description: "Former Olympic athlete with a passion for transforming lives through fitness.",
      achievements: ["Olympic Gold Medalist", "Certified Master Trainer", "Business Leadership Award 2023"]
    },
    {
      name: "Michael Chen",
      role: "Head of Training",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      description: "Certified master trainer with 15 years of experience in fitness coaching.",
      achievements: ["Master Trainer Certification", "Sports Science PhD", "Author of 'Peak Performance'"]
    },
    {
      name: "Emily Rodriguez",
      role: "Nutrition Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      description: "Registered dietitian specializing in sports nutrition and wellness.",
      achievements: ["Registered Dietitian", "Wellness Coach", "Nutrition Research Pioneer"]
    }
  ];

  const values = [
    {
      icon: FiHeart,
      title: "Passion",
      description: "We're driven by our love for fitness and helping others achieve their goals."
    },
    {
      icon: FiTrendingUp,
      title: "Excellence",
      description: "We strive for the highest standards in everything we do."
    },
    {
      icon: FiUsers,
      title: "Community",
      description: "We build strong, supportive communities that inspire and motivate."
    },
    {
      icon: FiSmile,
      title: "Inclusivity",
      description: "We welcome everyone, regardless of their fitness level or background."
    }
  ];

  const timeline = [
    {
      year: "2015",
      title: "The Beginning",
      description: "Founded our first gym with a vision to transform fitness",
      icon: FiActivity
    },
    {
      year: "2017",
      title: "Rapid Growth",
      description: "Expanded to 10 locations across the country",
      icon: FiTrendingUp
    },
    {
      year: "2019",
      title: "Innovation",
      description: "Launched digital fitness platform and mobile app",
      icon: FiGlobe
    },
    {
      year: "2023",
      title: "Global Impact",
      description: "Reached 5000+ members across 50+ locations",
      icon: FiUsers
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-900/50 to-indigo-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-full animate-float"
              style={{
                width: Math.random() * 300 + 50 + 'px',
                height: Math.random() * 300 + 50 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
              <FiActivity className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Transforming Lives Through Fitness
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Founded in 2015, FitConnect has grown from a single gym to a nationwide fitness movement. 
              Our mission is to make premium fitness accessible to everyone and build a community of 
              health-conscious individuals supporting each other's journey.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="px-6 py-2 rounded-full bg-violet-500/10 text-violet-400 font-medium">
                Premium Facilities
              </div>
              <div className="px-6 py-2 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
                Expert Trainers
              </div>
              <div className="px-6 py-2 rounded-full bg-violet-500/10 text-violet-400 font-medium">
                Global Community
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`group bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl transition-all duration-1000 transform hover:bg-gray-800/50 hover:scale-105 ${
                  statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-violet-400" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Our Journey
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-violet-500/50 to-indigo-500/50"></div>
            
            {/* Timeline Items */}
            <div className="space-y-20">
              {timeline.map((item, index) => (
                <div 
                  key={index}
                  className={`relative transition-all duration-1000 ${
                    timelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 rounded-full bg-gray-800 border-4 border-violet-500/50 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-violet-400" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-16 text-right' : 'pl-16 ml-auto'}`}>
                    <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl hover:bg-gray-800/50 transition-colors">
                      <div className="text-violet-400 font-bold mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`group bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] relative overflow-hidden ${
                  valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-7 h-7 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Meet Our Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className={`group relative transition-all duration-500 transform ${
                  teamInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-w-3 aspect-h-4 mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-violet-400 font-medium mb-4">{member.role}</p>
                <p className="text-gray-400 mb-4">{member.description}</p>
                <div className="space-y-2">
                  {member.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-400">
                      <FiCheck className="w-4 h-4 text-violet-400 mr-2" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20">
              <FiTarget className="w-8 h-8 text-violet-400" />
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Our Vision for the Future
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              We envision a world where everyone has access to premium fitness facilities, expert guidance, 
              and a supportive community. Through innovation and dedication, we're making this vision a reality, 
              one member at a time. Join us in creating a healthier, stronger future for all.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;