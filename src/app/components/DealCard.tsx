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

  const address = deal.vendorAddress || deal.location || '';
  const subline = address ? `${deal.vendor} • ${address}` : deal.vendor;

  return (
    <div
      onClick={() => navigate(`/app/deal/${deal.id}`)}
      className="glass-card rounded-2xl overflow-hidden card-lift cursor-pointer flex flex-row"
      style={{ minHeight: 120 }}
    >
      <div className="relative basis-2/5 w-2/5 flex-shrink-0">
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
          className="absolute top-2 left-2 w-8 h-8 glass rounded-full flex items-center justify-center active:scale-90 transition-all"
          aria-label={saved ? 'Remove from saved' : 'Save deal'}
        >
          <Heart
            size={16}
            className={saved ? 'text-[#10B981]' : 'text-white'}
            fill={saved ? '#10B981' : 'none'}
          />
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-2 min-w-0">
        <h3 className="text-[#064e3b] line-clamp-1">
          <strong style={{ fontSize: '16px' }}>{deal.title}</strong>
        </h3>
        <p className="text-gray-500 line-clamp-2" style={{ fontSize: '12px' }}>
          {subline}
        </p>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="line-through text-gray-400" style={{ fontSize: '12px' }}>
            ₹{deal.originalPrice}
          </span>
          <strong style={{ color: '#4CAF50', fontSize: '16px' }}>
            ₹{deal.currentPrice}
          </strong>
        </div>
      </div>
    </div>
  );
}
