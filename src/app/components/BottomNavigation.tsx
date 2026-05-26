import { Link, useLocation } from 'react-router';
import { Home, Search, Heart, Store, LayoutDashboard, PlusCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function BottomNavigation() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === '/app' || path === '/vendor') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const guestNav = [
    { path: '/app', icon: Home, label: 'Home' },
    { path: '/app/search', icon: Search, label: 'Search' },
    { path: '/app/favorites', icon: Heart, label: 'Bookmarks' },
    { path: '/app/vendor-hub', icon: Store, label: 'Vendor Hub' },
  ];

  const vendorNav = [
    { path: '/vendor', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/vendor/add-deal', icon: PlusCircle, label: 'Add Deal' },
    { path: '/app/search', icon: Search, label: 'Search' },
    { path: '/vendor/profile', icon: User, label: 'Profile' },
  ];

  const navItems = isAuthenticated ? vendorNav : guestNav;

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div
        className="flex items-center justify-around h-[68px] max-w-md mx-auto rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300"
            >
              {/* Active indicator pill */}
              {active && (
                <div className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full animate-fade-in-up" />
              )}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-br from-[#10B981] to-[#34D399] shadow-lg shadow-[#10B981]/30'
                    : ''
                }`}
              >
                <Icon
                  size={22}
                  className={`transition-colors duration-300 ${active ? 'text-white' : 'text-gray-400'}`}
                  strokeWidth={active ? 2.5 : 1.8}
                  fill={active && Icon === Heart ? 'currentColor' : 'none'}
                />
              </div>
              <span
                className={`text-[10px] transition-all duration-300 ${
                  active ? 'text-[#10B981]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
