import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BottomNavigation } from './BottomNavigation';

export function VendorRoot() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/vendor/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-[#F9FAFB] to-[#F9FAFB] pb-28" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Outlet />
      <BottomNavigation />
    </div>
  );
}
