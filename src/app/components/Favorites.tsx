import { useState, useMemo } from 'react';
import { Heart, ShoppingBag, Store, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { useFavorites } from '../contexts/FavoritesContext';
import { DealCard } from './DealCard';
import { Logo } from './Logo';

type Tab = 'restaurants' | 'deals';

export function Favorites() {
  const { favorites, clearFavorites } = useFavorites();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [tab, setTab] = useState<Tab>('deals');

  const restaurants = useMemo(() => {
    const map = new Map<string, { vendor: string; address: string; count: number }>();
    favorites.forEach((d) => {
      const key = d.vendor || 'Unknown';
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, {
          vendor: key,
          address: d.vendorAddress || d.location || 'Address unavailable',
          count: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [favorites]);

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Logo size={32} showText className="text-white" />
          {favorites.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-white active:scale-95 transition-all border border-white/10"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="glass-card rounded-full p-1 flex">
          <button
            onClick={() => setTab('restaurants')}
            className={`flex-1 py-3 rounded-full transition-all ${
              tab === 'restaurants'
                ? 'bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-lg'
                : 'text-gray-500'
            }`}
          >
            Saved Restaurants
          </button>
          <button
            onClick={() => setTab('deals')}
            className={`flex-1 py-3 rounded-full transition-all ${
              tab === 'deals'
                ? 'bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-lg'
                : 'text-gray-500'
            }`}
          >
            Saved Deals
          </button>
        </div>
      </div>

      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-24 h-24 glass-card rounded-full flex items-center justify-center mb-6">
            <Heart className="text-[#10B981]" size={40} />
          </div>
          <h2 className="text-[#064e3b] mb-3 text-center">No bookmarks yet</h2>
          <Link
            to="/app/search"
            className="px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center gap-2"
          >
            <ShoppingBag size={20} />
            <span>Browse Deals</span>
          </Link>
        </div>
      )}

      {favorites.length > 0 && tab === 'deals' && (
        <div className="px-4 pt-4 space-y-3">
          {favorites.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}

      {favorites.length > 0 && tab === 'restaurants' && (
        <div className="px-4 pt-4 space-y-3">
          {restaurants.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 text-center text-gray-500">
              No saved restaurants
            </div>
          ) : (
            restaurants.map((r) => (
              <div key={r.vendor} className="glass-card rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store size={18} className="text-[#10B981]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#064e3b]"><strong>{r.vendor}</strong></p>
                    <p className="text-gray-500 mt-1 flex items-start gap-1">
                      <MapPin size={12} className="text-[#10B981] mt-1 flex-shrink-0" />
                      <span className="line-clamp-2">{r.address}</span>
                    </p>
                    <p className="text-[#10B981] mt-2">{r.count} {r.count === 1 ? 'deal' : 'deals'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-0 sm:px-6"
          onClick={() => setShowClearConfirm(false)}
        >
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[#064e3b] mb-2">Clear all bookmarks?</h3>
            <p className="text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearFavorites();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl active:scale-95 transition-all shadow-lg"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
