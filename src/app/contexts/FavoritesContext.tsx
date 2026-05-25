import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { NormalizedDeal } from '../services/api';

interface FavoritesContextType {
  favorites: NormalizedDeal[];
  favoriteIds: Set<string>;
  toggleFavorite: (deal: NormalizedDeal) => void;
  isFavorite: (dealId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<NormalizedDeal[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem('freshbite_favorites');
      if (saved) {
        const parsed: NormalizedDeal[] = JSON.parse(saved);
        setFavorites(parsed);
        setFavoriteIds(new Set(parsed.map(d => d.id)));
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((deals: NormalizedDeal[]) => {
    localStorage.setItem('freshbite_favorites', JSON.stringify(deals));
  }, []);

  const toggleFavorite = useCallback((deal: NormalizedDeal) => {
    setFavorites(prev => {
      const exists = prev.some(d => d.id === deal.id);
      const next = exists ? prev.filter(d => d.id !== deal.id) : [...prev, deal];
      persist(next);
      setFavoriteIds(new Set(next.map(d => d.id)));
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback((dealId: string) => {
    return favoriteIds.has(dealId);
  }, [favoriteIds]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setFavoriteIds(new Set());
    localStorage.removeItem('freshbite_favorites');
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteIds, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
