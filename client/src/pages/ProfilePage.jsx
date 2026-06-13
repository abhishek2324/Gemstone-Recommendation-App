import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const zodiacSigns = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const months = [
  { value: '', label: 'Select month' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [zodiacSign, setZodiacSign] = useState(user?.zodiacSign || '');
  const [birthMonth, setBirthMonth] = useState(user?.birthMonth ? String(user.birthMonth) : '');
  const [favoriteColor, setFavoriteColor] = useState(user?.favoriteColor || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        zodiacSign: zodiacSign || undefined,
        birthMonth: birthMonth ? Number(birthMonth) : undefined,
        favoriteColor: favoriteColor || undefined,
      };
      const res = await userAPI.updateProfile(payload);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout size="narrow">
      <PageHeader
        badge="Account"
        title="User Profile"
        subtitle="Manage your personal details and gemstone preferences"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="card-glass-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-gem opacity-50 cursor-not-allowed"
              />
              <span className="text-text-muted text-xs mt-2 block">Email address cannot be changed</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-gem"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2.5">Zodiac Sign</label>
                <select
                  value={zodiacSign}
                  onChange={(e) => setZodiacSign(e.target.value)}
                  className="select-gem"
                >
                  {zodiacSigns.map((sign) => (
                    <option key={sign || 'empty'} value={sign}>
                      {sign || 'Select zodiac'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2.5">Birth Month</label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="select-gem"
                >
                  {months.map((m) => (
                    <option key={m.value || 'empty'} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2.5">Favorite Color</label>
              <input
                type="text"
                value={favoriteColor}
                onChange={(e) => setFavoriteColor(e.target.value)}
                className="input-gem"
                placeholder="e.g. Blue, Red, Green"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? 'Saving changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default ProfilePage;
