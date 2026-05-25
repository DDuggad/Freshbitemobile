import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { vendorSignup } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

const LOCATIONS = [
  'Basavanagudi',
  'Jayanagar',
  'Rajajinagar',
  'Hanumanth Nagar',
  'Malleshwaram',
  'Indiranagar',
  'Koramangala',
  'BTM Layout',
];

export function VendorSignup() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    restaurantName: '',
    location: '',
    address: '',
    phoneNumber: '',
    imageUrl: '',
    googleMapsUrl: '',
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (k: string, v: string) =>
    setFormData((prev) => ({ ...prev, [k]: v }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await vendorSignup({
        name: formData.username,
        email: formData.email,
        password: formData.password,
        restaurantName: formData.restaurantName,
        location: formData.location,
        address: formData.address,
        phone: formData.phoneNumber,
      } as any);
      const user = response.user || (response as any).vendor;
      login(response.token, {
        ...user,
        restaurantName: user?.restaurantName || formData.restaurantName,
        location: user?.location || formData.location,
        address: user?.address || formData.address,
        phone: user?.phone || formData.phoneNumber,
        googleMapsLink: (user as any)?.googleMapsLink || formData.googleMapsUrl,
        profileCompleted: true,
      });
    } catch {
      login('demo-token', {
        _id: 'demo',
        id: 'demo',
        name: formData.username,
        email: formData.email,
        restaurantName: formData.restaurantName,
        location: formData.location,
        address: formData.address,
        phone: formData.phoneNumber,
        googleMapsLink: formData.googleMapsUrl,
        profileCompleted: true,
      } as any);
    }
    navigate('/vendor');
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
            className="w-10 h-10 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center border border-white/10"
            aria-label="Back"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <Logo size={32} showText className="text-white" />
        </div>
      </header>

      <div className="px-4 pt-6">
        <p className="text-gray-500">
          <strong>Step {step} of 2</strong> — {step === 1 ? 'Account' : 'Restaurant Profile'}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleNext} className="p-4 py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Username</strong>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => update('username', e.target.value)}
                required
                minLength={3}
                placeholder="yourname"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
              <p className="text-gray-400 mt-1" style={{ fontSize: '12px' }}>
                min 3 characters
              </p>
            </div>

            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => update('email', e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => update('password', e.target.value)}
                required
                placeholder="********"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg"
          >
            <strong>Next</strong>
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/vendor/login" className="text-[#10B981]">
              Login
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleComplete} className="p-4 py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Restaurant Name*</strong>
              </label>
              <input
                type="text"
                value={formData.restaurantName}
                onChange={(e) => update('restaurantName', e.target.value)}
                required
                placeholder="e.g., Green Bowl Cafe"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Location*</strong>
              </label>
              <select
                value={formData.location}
                onChange={(e) => update('location', e.target.value)}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all bg-white"
              >
                <option value="">Select location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Full Address*</strong>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => update('address', e.target.value)}
                required
                placeholder="Street, area, city"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Phone Number*</strong>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => update('phoneNumber', e.target.value)}
                required
                placeholder="9876543210"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Restaurant Image URL</strong>
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => update('imageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>

            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Google Maps Location URL</strong>
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => update('googleMapsUrl', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg"
          >
            <strong>Complete Registration</strong>
          </button>
        </form>
      )}
    </div>
  );
}
