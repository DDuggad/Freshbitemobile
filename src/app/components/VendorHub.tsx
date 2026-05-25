import { Link } from 'react-router';
import { LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

export function VendorHub() {
  const { isAuthenticated, vendor } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <Logo size={32} showText className="text-white" />
      </header>

      <section className="px-4 py-10">
        <div className="glass-card rounded-3xl p-8 text-center">
          <Logo size={56} className="mx-auto mb-6" />
          <h2 className="text-[#064e3b] mb-3">Turn surplus into sales</h2>
          <p className="text-gray-500">Reach locals. Cut waste.</p>
        </div>
      </section>

      <section className="px-4 pb-6">
        {isAuthenticated && vendor ? (
          <div className="space-y-3">
            <div className="glass-card rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">Signed in as</p>
              <p className="text-sm text-[#064e3b]">{vendor.restaurantName || vendor.name}</p>
              <p className="text-xs text-gray-500">{vendor.email}</p>
            </div>
            <Link
              to="/vendor"
              className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              to="/vendor/login"
              className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <LogIn size={18} />
              Vendor Login
            </Link>
            <Link
              to="/vendor/signup"
              className="w-full py-4 bg-white/80 border-2 border-[#10B981] text-[#064e3b] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <UserPlus size={18} className="text-[#10B981]" />
              Register Business
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
