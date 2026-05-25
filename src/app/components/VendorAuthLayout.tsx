import { Outlet } from 'react-router';

export function VendorAuthLayout() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-[#F9FAFB] to-[#F9FAFB]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Outlet />
    </div>
  );
}
