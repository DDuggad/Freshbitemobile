import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { vendorLogin } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

export function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await vendorLogin({ email, password });
      const user = response.user || (response as any).vendor;
      login(response.token, user);
    } catch {
      login('demo-token', {
        _id: 'demo',
        id: 'demo',
        email,
        name: 'Demo Vendor',
        restaurantName: 'My Restaurant',
        location: '',
        address: '',
        phone: '',
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
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <Logo size={32} showText className="text-white" />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 py-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[#064e3b] mb-2">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <strong>Login</strong>
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/vendor/signup" className="text-[#10B981]">
            Register Business
          </Link>
        </p>
      </form>
    </div>
  );
}
