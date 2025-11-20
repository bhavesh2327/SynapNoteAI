import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Brain, 
  MessageCircle, 
  Search, 
  Zap,
  ArrowRight,
  Star,
  Users,
  Shield
} from 'lucide-react';

function Landing() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Automatically generate summaries, keywords, and improve your content with advanced AI.'
    },
    {
      icon: MessageCircle,
      title: 'Chat with Your Notes',
      description: 'Have conversations with your notes using AI to discover new insights and connections.'
    },
    {
      icon: Search,
      title: 'Smart Search & Organization',
      description: 'Find any note instantly with intelligent search across content, tags, and keywords.'
    },
    {
      icon: Zap,
      title: 'Instant Content Generation',
      description: 'Generate content from topics, create titles, and enhance your writing effortlessly.'
    }
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: '10K+' },
    { icon: BookOpen, label: 'Notes Created', value: '100K+' },
    { icon: Star, label: 'User Rating', value: '4.9/5' },
    { icon: Shield, label: 'Uptime', value: '99.9%' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">SynapNote</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              The intelligent note-taking platform that transforms your thoughts into organized, searchable knowledge with the power of AI.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              {!isAuthenticated && (
                <Link
                  to="/signin"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          </motion.div>
          
          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gradient-to-r from-primary-200 to-primary-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="flex space-x-2 mt-6">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">AI Generated</span>
                  <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm">Smart Tags</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Modern Note-Taking
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of note-taking with AI-powered features designed to enhance your productivity and creativity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card p-8 text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Note-Taking?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Start your journey with SynapNote today and experience the power of AI-enhanced productivity.
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Landing;