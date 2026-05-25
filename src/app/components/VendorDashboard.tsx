import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Loader2, Trash2, ToggleLeft, ToggleRight, ShoppingBag, Pencil } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getVendorDeals, deleteDeal, updateDeal, NormalizedDeal } from '../services/api';
import { Logo } from './Logo';

function DealRowSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 skeleton rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 skeleton" />
          <div className="h-4 w-1/3 skeleton" />
        </div>
      </div>
    </div>
  );
}

export function VendorDashboard() {
  const { vendor, token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [deals, setDeals] = useState<NormalizedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/vendor/login');
      return;
    }
    fetchVendorDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchVendorDeals = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getVendorDeals(token);
      setDeals(data);
    } catch (err) {
      console.error('Error loading vendor deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dealId: string) => {
    if (!token) return;
    setDeletingId(dealId);
    try {
      await deleteDeal(dealId, token);
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
    } catch (err) {
      console.error('Failed to delete deal:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (deal: NormalizedDeal) => {
    if (!token) return;
    setTogglingId(deal.id);
    try {
      await updateDeal(deal.id, { active: !deal.active }, token);
      setDeals((prev) => prev.map((d) => (d.id === deal.id ? { ...d, active: !d.active } : d)));
    } catch (err) {
      console.error('Failed to toggle deal:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/app');
  };

  if (!vendor) return null;

  const activeDeals = deals.filter((d) => d.active);

  return (
    <div className="min-h-screen pb-28" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Logo size={32} showText className="text-white" />
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-white active:scale-95 transition-all duration-300 border border-white/10"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="px-4 pt-6">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-gray-500">Active Deals</p>
          <p className="text-[#064e3b] mt-2" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
            {loading ? '—' : activeDeals.length}
          </p>
        </div>
      </section>

      <section className="px-4 pt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <DealRowSkeleton key={i} />)}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-[#10B981]" size={28} />
            </div>
            <p className="text-gray-500 mb-4">No deals yet</p>
            <button
              onClick={() => navigate('/vendor/add-deal')}
              className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg"
            >
              Create Your First Deal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <div key={deal.id} className="glass-card rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={deal.imageUrl || 'https://images.unsplash.com/photo-1756741987051-a6a38f28838b?w=200'}
                    alt={deal.title}
                    className={`w-16 h-16 rounded-xl object-cover flex-shrink-0 ${!deal.active ? 'opacity-50 grayscale' : ''}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#064e3b] truncate">{deal.title}</p>
                    <p className="mt-1" style={{ color: '#10B981' }}>₹{deal.currentPrice}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/vendor/edit-deal/${deal.id}`)}
                    aria-label="Edit deal"
                    className="w-11 h-11 rounded-xl bg-[#10B981]/10 hover:bg-[#10B981]/20 flex items-center justify-center active:scale-95 transition-all flex-shrink-0"
                  >
                    <Pencil size={18} className="text-[#10B981]" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100/60">
                  <button
                    onClick={() => handleToggleActive(deal)}
                    disabled={togglingId === deal.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-gray-600 active:bg-[#f0fdf4] transition-all disabled:opacity-50"
                  >
                    {togglingId === deal.id ? (
                      <Loader2 size={16} className="animate-spin text-[#10B981]" />
                    ) : deal.active ? (
                      <ToggleRight size={18} className="text-[#10B981]" />
                    ) : (
                      <ToggleLeft size={18} className="text-gray-400" />
                    )}
                    <span>{deal.active ? 'Active' : 'Inactive'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id)}
                    disabled={deletingId === deal.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-red-500 active:bg-red-50 transition-all disabled:opacity-50"
                  >
                    {deletingId === deal.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={() => navigate('/vendor/add-deal')}
        className="fixed bottom-28 right-4 z-40 px-6 py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-full active:scale-95 transition-all shadow-2xl flex items-center gap-2"
        aria-label="Add Deal"
      >
        <Plus size={22} />
        <span>Add Deal</span>
      </button>
    </div>
  );
}
