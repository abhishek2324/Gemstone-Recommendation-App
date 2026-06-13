import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoDiamond } from 'react-icons/io5';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Welcome to GemStone!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            <h1 className="font-outfit font-bold text-3xl md:text-4xl text-text-primary mb-3">Create Account</h1>
            <p className="text-text-muted text-base">Start your gemstone discovery journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-gem pl-11" placeholder="Your full name" required id="register-name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-gem pl-11" placeholder="your@email.com" required id="register-email" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-gem pl-11" placeholder="Min 6 characters" required id="register-password" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-gem pl-11" placeholder="Confirm password" required id="register-confirm" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 mt-2" id="register-submit">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-gem-400 hover:text-gem-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
