import { useEffect, useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { getDeals, NormalizedDeal } from '../services/api';
import { DealCard } from './DealCard';
import { Logo } from './Logo';

const CATEGORIES = ['All', 'South Indian', 'North Indian', 'Italian', 'Chinese', 'Jain'];

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deals, setDeals] = useState<NormalizedDeal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await getDeals();
        setDeals(data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filtered = deals.filter((deal) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      deal.title.toLowerCase().includes(q) ||
      deal.vendor.toLowerCase().includes(q) ||
      deal.location.toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Jain' ? deal.isJain : deal.foodType?.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <div className="mb-3">
          <Logo size={32} showText className="text-white" />
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder=""
            className="w-full pl-12 pr-10 py-3.5 bg-white/95 backdrop-blur rounded-2xl border-2 border-transparent focus:outline-none focus:border-[#10B981]/40 text-[#064e3b] text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <X className="text-gray-400" size={14} />
            </button>
          )}
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="flex flex-wrap gap-2 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-4 space-y-3">
        {isLoading && (
          <div className="glass-card rounded-2xl p-6 text-center text-sm text-gray-500">
            Loading deals...
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="text-gray-400" size={32} />
            </div>
            <p className="text-sm text-gray-500 mb-2">No deals found</p>
            <p className="text-xs text-gray-400">Try a different search or category</p>
          </div>
        )}
        {!isLoading && filtered.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
