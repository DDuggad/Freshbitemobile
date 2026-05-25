import { Link } from 'react-router';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <Logo size={32} showText className="text-white" />
      </header>

      <section className="px-4 py-6 space-y-6">
        {/* App Intro */}
        <div className="space-y-3 py-2">
          <h1 className="text-[#064e3b]" style={{ fontSize: '26px', lineHeight: 1.2 }}>
            <strong>Your Local Food Connection.</strong>
          </h1>
          <p className="text-gray-600" style={{ fontSize: '14px', lineHeight: 1.5 }}>
            Discover exclusive dine-in and pickup deals from the best local restaurants near you. No delivery fees, just great food.
          </p>
        </div>

        {/* For Users */}
        <div className="glass-card rounded-3xl p-4 space-y-4" style={{ background: 'rgba(16, 185, 129, 0.06)' }}>
          <p className="uppercase text-[#10B981]" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            For Users
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-[#064e3b]"><strong>500+</strong></p>
              <p className="text-gray-500" style={{ fontSize: '11px' }}>Local Deals</p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-[#064e3b]"><strong>100+</strong></p>
              <p className="text-gray-500" style={{ fontSize: '11px' }}>Restaurants</p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-[#064e3b]"><strong>70%</strong></p>
              <p className="text-gray-500" style={{ fontSize: '11px' }}>Avg Savings</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Sparkles size={14} className="text-[#10B981] flex-shrink-0" />
              <span>Discover exclusive dine-in offers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check size={14} className="text-[#10B981] flex-shrink-0" />
              <span>Save your favorites locally</span>
            </div>
          </div>

          <Link
            to="/app/search"
            className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>Browse Deals</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* For Vendors */}
        <div className="glass-card rounded-3xl p-4 space-y-4">
          <p className="uppercase text-[#10B981]" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
            For Vendors
          </p>

          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-[#064e3b]"><strong>Increase</strong></p>
              <p className="text-gray-500" style={{ fontSize: '11px' }}>Foot Traffic</p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-[#064e3b]"><strong>Zero</strong></p>
              <p className="text-gray-500" style={{ fontSize: '11px' }}>Commission</p>
            </div>
            <div className="glass-card rounded-2xl p-3 text-center">
              <p className="text-[#064e3b]"><strong>Real-time</strong></p>
              <p className="text-gray-500" style={{ fontSize: '11px' }}>Updates</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Check size={14} className="text-[#10B981] flex-shrink-0" />
              <span>Manage deals in real-time</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Sparkles size={14} className="text-[#10B981] flex-shrink-0" />
              <span>Attract local diners</span>
            </div>
          </div>

          <Link
            to="/app/vendor-hub"
            className="w-full py-4 bg-white/80 border-2 border-[#10B981] text-[#064e3b] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Vendor Sign Up / Log In</span>
            <ArrowRight size={18} className="text-[#10B981]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
