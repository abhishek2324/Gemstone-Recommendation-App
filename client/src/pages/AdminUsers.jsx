import { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../services/api';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { IoTrash } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.data.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? All their history will be lost.')) return;
    try {
      await userAPI.deleteUser(id);
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <PageLayout size="full">
      <PageHeader
        badge="Admin"
        title="Manage Users"
        subtitle="View and manage registered users in the system"
        actions={
          <Link to="/admin" className="btn-secondary !py-2.5 !px-5 text-sm">Back to Dashboard</Link>
        }
      />

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="card-glass-lg overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Zodiac</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-outfit font-semibold text-text-primary">{u.name}</td>
                    <td className="text-text-secondary">{u.email}</td>
                    <td>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-gem-500/20 text-gem-300' : 'bg-white/5 text-text-muted'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-text-secondary">{u.zodiacSign || '—'}</td>
                    <td className="text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          aria-label={`Delete ${u.name}`}
                        >
                          <IoTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AdminUsers;
