import { useState, useEffect, useCallback, useMemo } from 'react';
import { gemstoneAPI } from '../services/api';
import GemstoneCard from '../components/GemstoneCard';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { IoSearch, IoFilter } from 'react-icons/io5';
import toast from 'react-hot-toast';

const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'White', 'Pink', 'Orange', 'Black', 'Brown'];
const categories = ['precious', 'semi-precious', 'organic'];
const purposes = ['career', 'wealth', 'health', 'love', 'education', 'protection', 'spiritual'];

const CatalogPage = () => {
  const [gemstones, setGemstones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchGemstones = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: debouncedSearch || undefined,
        color: selectedColor || undefined,
        category: selectedCategory || undefined,
        purpose: selectedPurpose || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        page,
        limit: 9,
      };
      const res = await gemstoneAPI.getAll(params);
      setGemstones(res.data.data);
      setTotalPages(res.data.pages);
    } catch {
      toast.error('Failed to load gemstones');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedColor, selectedCategory, selectedPurpose, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchGemstones();
  }, [fetchGemstones]);

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedColor('');
    setSelectedCategory('');
    setSelectedPurpose('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const activeFilterCount = useMemo(
    () => [debouncedSearch, selectedColor, selectedCategory, selectedPurpose, minPrice, maxPrice].filter(Boolean).length,
    [debouncedSearch, selectedColor, selectedCategory, selectedPurpose, minPrice, maxPrice]
  );

  return (
    <PageLayout size="full">
      <PageHeader
        badge="Explore"
        title="Gemstone Catalog"
        subtitle="Explore our curated gemstones and their metaphysical benefits"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
        <aside className="lg:col-span-1">
          <div className="card-glass sticky top-28">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-outfit font-bold text-lg text-text-primary flex items-center gap-2">
                <IoFilter /> Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-gem-500/20 text-gem-300 text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-gem-400 hover:text-gem-300 text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search name, benefits..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="input-gem !py-3 pl-11"
                  />
                  <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => { setSelectedColor(e.target.value); setPage(1); }}
                  className="select-gem !py-3"
                >
                  <option value="">All Colors</option>
                  {colors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                  className="select-gem !py-3 capitalize"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Purpose</label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => { setSelectedPurpose(e.target.value); setPage(1); }}
                  className="select-gem !py-3 capitalize"
                >
                  <option value="">All Purposes</option>
                  {purposes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Price Range (₹)</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="input-gem !py-3 text-center"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="input-gem !py-3 text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner size="lg" text="Fetching gemstones..." />
          ) : gemstones.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-10">
                {gemstones.map((gem, i) => (
                  <GemstoneCard key={gem._id} gemstone={gem} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="btn-secondary !py-2.5 !px-5 disabled:opacity-45"
                  >
                    Previous
                  </button>
                  <span className="text-text-secondary text-sm font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="btn-secondary !py-2.5 !px-5 disabled:opacity-45"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="card-glass-lg text-center py-16">
              <h3 className="font-outfit font-bold text-2xl text-text-primary mb-3">No Gemstones Found</h3>
              <p className="text-text-muted mb-6 max-w-md mx-auto">We couldn't find any gemstones matching your filter criteria.</p>
              <button onClick={handleClearFilters} className="btn-primary">Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CatalogPage;
