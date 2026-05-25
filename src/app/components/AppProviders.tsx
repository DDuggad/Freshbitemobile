import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

export function AppProviders() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Outlet />
      </FavoritesProvider>
    </AuthProvider>
  );
}
