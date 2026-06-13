import { Link } from 'react-router-dom';
import { IoDiamond } from 'react-icons/io5';
import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle bg-surface-light/50 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <IoDiamond className="text-2xl text-gem-400" />
              <span className="font-outfit font-bold text-xl text-gradient">GemStone</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Discover your perfect gemstone through our intelligent recommendation system powered by astrological wisdom.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-outfit font-semibold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/catalog', label: 'Gemstone Catalog' },
                { to: '/recommend', label: 'Get Recommendation' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-text-muted hover:text-gem-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-outfit font-semibold text-text-primary mb-4">Account</h4>
            <ul className="space-y-2">
              {[
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Sign Up' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/profile', label: 'Profile' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-text-muted hover:text-gem-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-outfit font-semibold text-text-primary mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-surface-card flex items-center justify-center text-text-muted hover:text-gem-400 hover:bg-surface-hover transition-all">
                <FaGithub size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-surface-card flex items-center justify-center text-text-muted hover:text-gem-400 hover:bg-surface-hover transition-all">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} GemStone Recommend. All rights reserved.
          </p>
          <p className="text-text-muted text-sm flex items-center gap-1">
            Made with <FaHeart className="text-danger text-xs" /> by Abhishek
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
