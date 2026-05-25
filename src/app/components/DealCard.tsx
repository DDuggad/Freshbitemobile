import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { NormalizedDeal } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DealCardProps {
  deal: NormalizedDeal;
}

export function DealCard({ deal }: DealCardProps) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const saved = isFavorite(deal.id);

  const address =
    deal.vendorAddress || deal.location || 'Address unavailable';

  return (
    <div
      onClick={() => navigate(`/app/deal/${deal.id}`)}
      className="glass-card rounded-2xl overflow-hidden card-lift cursor-pointer"
    >
      <div className="relative h-44 overflow-hidden">
        <ImageWithFallback
          src={deal.imageUrl || 'https://images.unsplash.com/photo-1756741987051-a6a38f28838b?w=600'}
          alt={deal.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(deal);
          }}
          className="absolute top-3 right-3 w-10 h-10 glass rounded-full flex items-center justify-center active:scale-90 transition-all duration-300 shadow-lg"
          aria-label={saved ? 'Remove from saved' : 'Save deal'}
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${saved ? 'text-[#10B981]' : 'text-white'}`}
            fill={saved ? '#10B981' : 'none'}
          />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[#064e3b]">
          <strong>{deal.vendor}</strong>
        </p>
        <h3 className="text-[#064e3b] mt-1">{deal.title}</h3>
        <p className="text-gray-500 mt-2 line-clamp-2">{address}</p>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-gray-400 line-through">₹{deal.originalPrice}</span>
          <span style={{ color: '#10B981' }}>₹{deal.currentPrice}</span>
        </div>
      </div>
    </div>
  );
}
