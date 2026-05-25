import { Outlet } from 'react-router';
import { BottomNavigation } from './BottomNavigation';

export function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-[#F9FAFB] to-[#F9FAFB] pb-28" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Outlet />
      <BottomNavigation />
    </div>
  );
}