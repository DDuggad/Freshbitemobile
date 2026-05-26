import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, LogOut, Pencil, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getVendorDealsByVendorId, getDeals, NormalizedDeal } from '../services/api';
import { Logo } from './Logo';
import { DealCard } from './DealCard';

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

type Tab = 'active' | 'expired';

export function VendorDashboard() {
  const { vendor, token, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [deals, setDeals] = useState<NormalizedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('active');

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
      let data: NormalizedDeal[] = [];
      if (vendor?.id) {
        try {
          data = await getVendorDealsByVendorId(vendor.id);
        } catch {
          // Fall back: filter the public deals list to this vendor
          const all = await getDeals();
          data = all.filter(
            (d) => d.vendorId === vendor.id || d.vendor === vendor.restaurantName
          );
        }
      }
      setDeals(data);
    } catch (err) {
      console.error('Error loading vendor deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/app');
  };

  if (!vendor) return null;

  const now = Date.now();
  const isExpired = (d: NormalizedDeal) => {
    if (d.active === false) return true;
    if (d.validUntil) {
      const t = new Date(d.validUntil).getTime();
      if (!isNaN(t) && t < now) return true;
    }
    return false;
  };

  const filtered = deals
    .filter((d) => (tab === 'active' ? !isExpired(d) : isExpired(d)))
    .sort((a, b) => {
      const ta = a.validUntil ? new Date(a.validUntil).getTime() : 0;
      const tb = b.validUntil ? new Date(b.validUntil).getTime() : 0;
      return tab === 'active' ? ta - tb : tb - ta;
    });

  return (
    <div className="min-h-screen pb-28" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-white truncate">
              <strong>{vendor?.restaurantName || vendor?.username || 'Setup Profile'}</strong>
            </p>
          </div>
          <Logo size={32} />
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="w-10 h-10 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center border border-white/10 active:scale-95 transition-all"
          >
            <LogOut className="text-white" size={18} />
          </button>
        </div>
      </header>

      <div className="px-4 pt-6">
        <div className="glass-card rounded-full p-1 flex">
          <button
            onClick={() => setTab('active')}
            className={`flex-1 py-3 rounded-full transition-all ${
              tab === 'active'
                ? 'bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-lg'
                : 'text-gray-500'
            }`}
          >
            Active Deals
          </button>
          <button
            onClick={() => setTab('expired')}
            className={`flex-1 py-3 rounded-full transition-all ${
              tab === 'expired'
                ? 'bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-lg'
                : 'text-gray-500'
            }`}
          >
            Expired Deals
          </button>
        </div>
      </div>

      <section className="px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <DealRowSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-[#10B981]" size={28} />
            </div>
            <p className="text-gray-500 mb-4">
              {tab === 'active' ? 'No active deals' : 'No expired deals'}
            </p>
            {tab === 'active' && (
              <button
                onClick={() => navigate('/vendor/add-deal')}
                className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg"
              >
                Create Your First Deal
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((deal) => (
              <div key={deal.id} className="relative">
                <DealCard deal={deal} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/vendor/edit-deal/${deal.id}`);
                  }}
                  aria-label="Edit deal"
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/95 shadow-lg flex items-center justify-center active:scale-90 transition-all z-10"
                >
                  <Pencil size={16} className="text-[#10B981]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={() => navigate('/vendor/add-deal')}
        className="fixed bottom-28 right-4 z-40 w-14 h-14 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-full active:scale-95 transition-all shadow-2xl flex items-center justify-center"
        aria-label="+ Add New Deal"
        title="+ Add New Deal"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
