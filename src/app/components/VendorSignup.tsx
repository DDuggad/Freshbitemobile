import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Loader2, Mail, Lock, User, Store, MapPin } from 'lucide-react';
import { vendorSignup } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

export function VendorSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    restaurantName: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await vendorSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        restaurantName: formData.restaurantName,
        address: formData.address,
      });
      const user = response.user || (response as any).vendor;
      login(response.token, {
        ...user,
        restaurantName: user.restaurantName || formData.restaurantName,
        address: user.address || formData.address,
        profileCompleted: true,
      });
      navigate('/vendor');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields: Array<{
    label: string;
    name: keyof typeof formData;
    type?: string;
    placeholder: string;
    Icon: typeof User;
  }> = [
    { label: 'Full Name', name: 'name', placeholder: 'Your full name', Icon: User },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com', Icon: Mail },
    { label: 'Password', name: 'password', type: 'password', placeholder: '********', Icon: Lock },
    { label: 'Restaurant / Business Name', name: 'restaurantName', placeholder: 'e.g., Green Bowl Cafe', Icon: Store },
    { label: 'Business Address', name: 'address', placeholder: 'Street, area, city', Icon: MapPin },
  ];

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

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="glass-card rounded-2xl p-4 space-y-4">
          {fields.map(({ label, name, type = 'text', placeholder, Icon }) => (
            <div key={name}>
              <label className="block text-sm text-[#064e3b] mb-2">{label}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Icon className="text-gray-400" size={18} />
                </div>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Register Business</span>
          )}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/vendor/login" className="text-[#10B981]">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
