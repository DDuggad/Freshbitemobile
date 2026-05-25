import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Heart, Phone, MapPin, Loader2, Clock } from 'lucide-react';
import { getDeals, NormalizedDeal } from '../services/api';
import { useFavorites } from '../contexts/FavoritesContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Logo } from './Logo';

export function DealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [deal, setDeal] = useState<NormalizedDeal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await getDeals();
        const found = list.find((d) => d.id === id);
        setDeal(found ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#10B981]" size={32} />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <Logo size={40} className="mb-3" />
        <p className="text-[#064e3b] mb-4">Deal not found</p>
        <button
          onClick={() => navigate('/app')}
          className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl text-sm"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const saved = isFavorite(deal.id);
  const description =
    deal.description ||
    `Delicious surplus pick from ${deal.vendor}. Grab it before it's gone!`;

  const phone = deal.vendorPhone;
  const validUntilDate = deal.validUntil ? new Date(deal.validUntil) : null;
  const validUntilFormatted =
    validUntilDate && !isNaN(validUntilDate.getTime())
      ? validUntilDate.toLocaleString(undefined, {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: 'numeric',
          minute: '2-digit',
        })
      : null;
  const mapsUrl =
    deal.googleMapsLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      deal.vendorAddress || deal.vendor || deal.location || ''
    )}`;

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div className="flex-1 flex justify-center">
            <Logo size={32} showText className="text-white" />
          </div>
          <button
            onClick={() => toggleFavorite(deal)}
            className="w-10 h-10 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center border border-white/10"
            aria-label={saved ? 'Remove from saved' : 'Save deal'}
          >
            <Heart
              size={18}
              className={saved ? 'text-[#34D399]' : 'text-white'}
              fill={saved ? '#34D399' : 'none'}
            />
          </button>
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="relative h-56">
            <ImageWithFallback
              src={deal.imageUrl || 'https://images.unsplash.com/photo-1756741987051-a6a38f28838b?w=800'}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg text-[#064e3b] mb-2">{deal.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            {validUntilFormatted && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                <Clock size={14} className="text-[#10B981] flex-shrink-0" />
                <span className="text-gray-500" style={{ fontSize: '12px' }}>Valid Until</span>
                <span className="text-[#064e3b] ml-auto" style={{ fontSize: '12px' }}>
                  <strong>{validUntilFormatted}</strong>
                </span>
              </div>
            )}
            <div className="mb-4">
              <p className="text-[#064e3b]"><strong>{deal.vendor}</strong></p>
              {(deal.vendorAddress || deal.location) && (
                <p className="text-gray-500 mt-1">{deal.vendorAddress || deal.location}</p>
              )}
            </div>
            <div className="flex items-baseline gap-3 pt-3 border-t border-gray-100">
              <span className="text-2xl text-[#10B981]">₹{deal.currentPrice}</span>
              <span className="text-sm text-gray-400 line-through">₹{deal.originalPrice}</span>
              {deal.discount > 0 && (
                <span className="text-xs text-red-500 ml-auto">{deal.discount}% OFF</span>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="fixed bottom-24 left-4 right-4 z-40 flex gap-3 max-w-md mx-auto">
        <a
          href={`tel:${phone}`}
          className="flex-1 py-4 bg-white/90 backdrop-blur border border-[#10B981]/30 text-[#064e3b] rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Phone size={18} className="text-[#10B981]" />
          Call Vendor
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <MapPin size={18} />
          Get Directions
        </a>
      </div>
    </div>
  );
}
