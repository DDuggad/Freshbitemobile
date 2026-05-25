import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from './Logo';

export function Splash() {
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div
        className={`text-center transition-all duration-1000 ${
          fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <Logo size={96} className="mb-6 mx-auto shadow-2xl animate-pulse" />
      </div>
    </div>
  );
}
