import { useState, useEffect, useCallback } from 'react';
import { gemstoneAPI } from '../services/api';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { IoAdd, IoTrash, IoPencil, IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const categories = ['precious', 'semi-precious', 'organic'];

const emptyForm = {
  name: '',
  color: '',
  zodiacSigns: [],
  birthMonths: [],
  purposes: [],
  description: '',
  benefits: [],
  image: '',
  priceRange: { min: 0, max: 0 },
  category: 'precious',
};

const AdminGemstones = () => {
  const [gemstones, setGemstones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchGemstones = useCallback(async () => {
    try {
      const res = await gemstoneAPI.getAll({ limit: 100 });
      setGemstones(res.data.data);
    } catch {
      toast.error('Failed to load gemstones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGemstones();
  }, [fetchGemstones]);

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (gem) => {
    setForm({
      name: gem.name,
      color: gem.color,
      zodiacSigns: gem.zodiacSigns || [],
      birthMonths: gem.birthMonths || [],
      purposes: gem.purposes || [],
      description: gem.description,
      benefits: gem.benefits || [],
      image: gem.image || '',
      priceRange: { min: gem.priceRange.min, max: gem.priceRange.max },
      category: gem.category,
    });
    setEditingId(gem._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gemstone?')) return;
    try {
      await gemstoneAPI.delete(id);
      toast.success('Gemstone deleted successfully!');
      fetchGemstones();
    } catch {
      toast.error('Failed to delete gemstone');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await gemstoneAPI.update(editingId, form);
        toast.success('Gemstone updated!');
      } else {
        await gemstoneAPI.create(form);
        toast.success('Gemstone created!');
      }
      setModalOpen(false);
      fetchGemstones();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <PageLayout size="full">
      <PageHeader
        badge="Admin"
        title="Manage Gemstones"
        subtitle="Add, edit, or delete gemstones from the catalog"
        actions={
          <>
            <Link to="/admin" className="btn-secondary !py-2.5 !px-5 text-sm">Back to Dashboard</Link>
            <button onClick={handleOpenAdd} className="btn-primary flex items-center gap-2 !py-2.5 !px-5 text-sm">
              <IoAdd /> Add Gemstone
            </button>
          </>
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
                  <th>Category</th>
                  <th>Color</th>
                  <th>Price Range (₹)</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gemstones.map((gem) => (
                  <tr key={gem._id}>
                    <td className="font-outfit font-semibold text-text-primary">{gem.name}</td>
                    <td className="capitalize text-text-secondary">{gem.category}</td>
                    <td className="text-text-secondary">{gem.color}</td>
                    <td className="text-gold-400">
                      ₹{gem.priceRange.min.toLocaleString()} - ₹{gem.priceRange.max.toLocaleString()}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(gem)}
                          className="p-2.5 rounded-xl bg-gem-500/10 text-gem-300 hover:bg-gem-500/20 transition-colors"
                          aria-label={`Edit ${gem.name}`}
                        >
                          <IoPencil />
                        </button>
                        <button
                          onClick={() => handleDelete(gem._id)}
                          className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          aria-label={`Delete ${gem.name}`}
                        >
                          <IoTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-6">
          <div className="card-glass-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close modal"
            >
              <IoClose size={24} />
            </button>
            <h2 className="font-outfit font-bold text-2xl mb-8 pr-10">
              {editingId ? 'Edit Gemstone' : 'Add New Gemstone'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-gem" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Color</label>
                  <input type="text" required value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="input-gem" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="select-gem capitalize">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Image URL</label>
                  <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-gem" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Min Price (₹)</label>
                  <input type="number" required value={form.priceRange.min} onChange={(e) => setForm({ ...form, priceRange: { ...form.priceRange, min: Number(e.target.value) } })} className="input-gem" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-secondary">Max Price (₹)</label>
                  <input type="number" required value={form.priceRange.max} onChange={(e) => setForm({ ...form, priceRange: { ...form.priceRange, max: Number(e.target.value) } })} className="input-gem" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Zodiac Signs (comma separated)</label>
                <input type="text" placeholder="e.g. Aries, Leo, Cancer" value={form.zodiacSigns.join(', ')} onChange={(e) => setForm({ ...form, zodiacSigns: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className="input-gem" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Birth Months (comma separated numbers 1-12)</label>
                <input type="text" placeholder="e.g. 5, 8" value={form.birthMonths.join(', ')} onChange={(e) => setForm({ ...form, birthMonths: e.target.value.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n) && n > 0) })} className="input-gem" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Purposes (comma separated)</label>
                <input type="text" placeholder="e.g. wealth, career" value={form.purposes.join(', ')} onChange={(e) => setForm({ ...form, purposes: e.target.value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) })} className="input-gem" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Description</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-gem h-24 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Benefits (one per line)</label>
                <textarea placeholder="Benefit 1&#10;Benefit 2" value={form.benefits.join('\n')} onChange={(e) => setForm({ ...form, benefits: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })} className="input-gem h-24 resize-none" />
              </div>

              <button type="submit" className="btn-primary w-full !py-3.5">
                {editingId ? 'Save Changes' : 'Add Gemstone'}
              </button>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AdminGemstones;
