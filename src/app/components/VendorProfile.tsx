import { useNavigate } from 'react-router';
import { LogOut, Store, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

export function VendorProfile() {
  const { vendor, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/app');
  };

  if (!isAuthenticated || !vendor) return null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <Logo size={32} showText className="text-white" />
      </header>

      <div className="px-4 pt-4 mb-4">
        <div className="glass-card rounded-2xl p-4 mb-3">
          <p className="text-[#064e3b] truncate"><strong>{vendor?.restaurantName || vendor?.username || 'Setup Profile'}</strong></p>
          <p className="text-gray-500 truncate">{vendor?.email}</p>
        </div>
      </div>

      <div className="px-4 relative z-10 mb-4">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-3">Business Details</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-[#064e3b]">
              <Store size={16} className="text-[#10B981]" />
              {vendor?.restaurantName || vendor?.username || 'Setup Profile'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={16} className="text-[#10B981]" />
              {vendor?.email}
            </div>
            {vendor.address && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-[#10B981]" />
                {vendor.address}
              </div>
            )}
            {vendor.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-[#10B981]" />
                {vendor.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 mt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 glass-card border border-red-100 rounded-2xl active:bg-red-50 transition-all text-red-500 hover:border-red-200"
        >
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
