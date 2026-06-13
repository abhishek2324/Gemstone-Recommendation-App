import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoDiamond, IoSparkles, IoShield, IoHeart, IoSearch } from 'react-icons/io5';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: <IoSparkles className="text-2xl" />,
    title: 'Smart Recommendations',
    description: 'Our AI-powered engine analyzes your zodiac, birth month, and preferences to find your perfect gemstone.',
    color: 'text-gem-400',
  },
  {
    icon: <IoSearch className="text-2xl" />,
    title: 'Extensive Catalog',
    description: 'Browse our curated collection of 20+ precious and semi-precious gemstones with detailed information.',
    color: 'text-gold-400',
  },
  {
    icon: <IoShield className="text-2xl" />,
    title: 'Trusted Guidance',
    description: 'Each recommendation is backed by traditional astrological wisdom and gemological expertise.',
    color: 'text-emerald-400',
  },
  {
    icon: <IoHeart className="text-2xl" />,
    title: 'Personalized for You',
    description: 'Whether for career, love, health, or wealth — find the gemstone aligned with your life purpose.',
    color: 'text-pink-400',
  },
];

const testimonials = [
  { name: 'Priya S.', text: 'The recommendation was spot on! My Yellow Sapphire has brought amazing clarity to my career decisions.', rating: 5 },
  { name: 'Rahul M.', text: 'I was skeptical at first, but the Emerald recommended for my Taurus sign has genuinely improved my focus.', rating: 5 },
  { name: 'Anita K.', text: 'Beautiful interface and accurate suggestions. The Rose Quartz has been a wonderful companion.', rating: 4 },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-mesh">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gem-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gem-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-gem-300">
              <IoDiamond className="text-gold-400" />
              <span>Discover Your Perfect Gemstone</span>
              <IoSparkles className="text-gold-400" />
            </div>

            <h1 className="font-outfit font-extrabold text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              Find Your{' '}
              <span className="text-gradient">Perfect</span>
              <br />
              <span className="text-gradient-gold">Gemstone</span>
            </h1>

            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Unlock the power of gemstones with our intelligent recommendation system. 
              Based on your zodiac sign, birth month, and life purpose — discover the stone meant for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? '/recommend' : '/register'}
                className="btn-gold text-lg px-8 py-4 flex items-center gap-2 group"
              >
                Get Your Recommendation
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/catalog" className="btn-secondary text-lg px-8 py-4">
                Browse Catalog
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-gem-500/30 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-gem-400 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-surface-light/30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="font-outfit font-bold text-4xl md:text-5xl text-text-primary mb-4">
              Why Choose <span className="text-gradient">GemStone</span>?
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              We combine astrological wisdom with modern technology to bring you the most accurate gemstone recommendations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glass hover:-translate-y-1 transition-transform duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-5 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="font-outfit font-semibold text-xl text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-mesh">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-outfit font-bold text-4xl md:text-5xl text-text-primary mb-4">
              How It <span className="text-gradient-gold">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Share Preferences', desc: 'Tell us your zodiac sign, birth month, favorite color, budget, and life purpose.' },
              { step: '02', title: 'AI Analysis', desc: 'Our recommendation engine scores each gemstone against your unique profile.' },
              { step: '03', title: 'Get Results', desc: 'Receive personalized gemstone recommendations with match scores and reasons.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-accent flex items-center justify-center mb-6 text-2xl font-outfit font-bold text-white">
                  {item.step}
                </div>
                <h3 className="font-outfit font-semibold text-xl text-text-primary mb-3">{item.title}</h3>
                <p className="text-text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface-light/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-outfit font-bold text-4xl md:text-5xl text-text-primary mb-4">
              What Users <span className="text-gradient">Say</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FaStar key={j} className="text-gold-400 text-sm" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-outfit font-semibold text-text-primary text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-mesh">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <IoDiamond className="text-6xl text-gem-400 mx-auto mb-6 animate-float" />
            <h2 className="font-outfit font-bold text-4xl md:text-5xl text-text-primary mb-6">
              Ready to Find Your Gemstone?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Join thousands of users who have discovered their perfect gemstone match through our platform.
            </p>
            <Link to={user ? '/recommend' : '/register'} className="btn-gold text-lg px-10 py-4 inline-flex items-center gap-2 group">
              Start Now — It's Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
