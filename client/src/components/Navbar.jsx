import { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { IoDiamond } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/catalog', label: 'Gemstones' },
      ...(user
        ? [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/recommend', label: 'Get Recommendation' },
            ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
          ]
        : []),
    ],
    [user]
  );

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'text-text-primary bg-gem-500/15 border border-gem-500/25'
        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
            <IoDiamond className="text-2xl text-gem-400 group-hover:text-gold-400 transition-colors duration-300" />
            <span className="font-outfit font-bold text-xl text-gradient">GemStone</span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-accent flex items-center justify-center text-sm font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-text-secondary max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn-secondary !py-2.5 !px-5 text-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary !py-2.5 !px-5 text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary !py-2.5 !px-5 text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border-subtle overflow-hidden"
          >
            <div className="px-5 py-5 space-y-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3.5 rounded-xl transition-all ${linkClass(link.to)}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border-subtle">
                {user ? (
                  <button onClick={handleLogout} className="w-full btn-secondary text-sm">
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2.5">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center btn-secondary text-sm">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center btn-primary text-sm">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
