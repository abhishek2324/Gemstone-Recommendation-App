import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoDiamond } from 'react-icons/io5';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh px-5 pt-28 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card-glass-lg">
          <div className="text-center mb-10">
            <IoDiamond className="text-5xl text-gem-400 mx-auto mb-5" />
            <h1 className="font-outfit font-bold text-3xl md:text-4xl text-text-primary mb-3">Welcome Back</h1>
            <p className="text-text-muted text-base">Sign in to access your gemstone journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-gem pl-11"
                  placeholder="your@email.com"
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-gem pl-11"
                  placeholder="••••••••"
                  required
                  id="login-password"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2" id="login-submit">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* <div className="mt-8 p-5 rounded-2xl bg-gem-900/20 border border-gem-700/20">
            <p className="text-gem-300 text-sm font-medium mb-2">Demo Credentials:</p>
            <p className="text-text-muted text-sm">Admin: admin@gemstone.com / admin123</p>
            <p className="text-text-muted text-sm">User: user@gemstone.com / user123</p>
          </div> */}

          <p className="text-center text-text-muted text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-gem-400 hover:text-gem-300 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
