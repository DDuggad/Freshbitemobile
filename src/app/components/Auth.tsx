import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock, Mail, Phone, Building2, MapPin } from 'lucide-react';
import { Logo } from './Logo';

type AuthMode = 'login' | 'register';
type UserRole = 'customer' | 'vendor';

export function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('customer');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    restaurantName: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // Mock login for now - in production this would call the API
        // For demo purposes, check if it's a vendor or customer based on email
        const mockRole = formData.email.includes('vendor') ? 'vendor' : 'customer';
        
        // Store mock auth data
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        localStorage.setItem('userRole', mockRole);
        
        navigate(mockRole === 'vendor' ? '/vendor' : '/app');
      } else {
        // Mock signup
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        localStorage.setItem('userRole', role);
        
        navigate(role === 'vendor' ? '/vendor' : '/app');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size={64} className="mx-auto shadow-lg" />
        </div>

        {/* Glass card */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/50 p-8">
          {/* Mode tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-emerald-100/50 rounded-2xl">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Register
            </button>
          </div>

          {/* Role selection (only for register) */}
          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-emerald-900 mb-3">
                I am a
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    role === 'customer'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-emerald-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <User className={`w-6 h-6 mx-auto mb-2 ${role === 'customer' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <div className={`font-semibold ${role === 'customer' ? 'text-emerald-900' : 'text-emerald-700'}`}>
                    Customer
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    role === 'vendor'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-emerald-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <Building2 className={`w-6 h-6 mx-auto mb-2 ${role === 'vendor' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <div className={`font-semibold ${role === 'vendor' ? 'text-emerald-900' : 'text-emerald-700'}`}>
                    Vendor
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (register only) */}
            {mode === 'register' && (
              <div className="relative">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'name' || formData.name
                      ? 'text-emerald-600'
                      : 'text-emerald-400'
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur"
                  placeholder=" "
                />
                <label
                  className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                    focusedField === 'name' || formData.name
                      ? 'top-1 text-xs text-emerald-600'
                      : 'top-1/2 -translate-y-1/2 text-emerald-500'
                  }`}
                >
                  Full Name
                </label>
              </div>
            )}

            {/* Restaurant Name (register vendor only) */}
            {mode === 'register' && role === 'vendor' && (
              <div className="relative">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'restaurantName' || formData.restaurantName
                      ? 'text-emerald-600'
                      : 'text-emerald-400'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => handleFieldChange('restaurantName', e.target.value)}
                  onFocus={() => setFocusedField('restaurantName')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur"
                  placeholder=" "
                />
                <label
                  className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                    focusedField === 'restaurantName' || formData.restaurantName
                      ? 'top-1 text-xs text-emerald-600'
                      : 'top-1/2 -translate-y-1/2 text-emerald-500'
                  }`}
                >
                  Restaurant Name
                </label>
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'email' || formData.email
                    ? 'text-emerald-600'
                    : 'text-emerald-400'
                }`}
              >
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur"
                placeholder=" "
              />
              <label
                className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                  focusedField === 'email' || formData.email
                    ? 'top-1 text-xs text-emerald-600'
                    : 'top-1/2 -translate-y-1/2 text-emerald-500'
                }`}
              >
                Email Address
              </label>
            </div>

            {/* Phone (register only) */}
            {mode === 'register' && (
              <div className="relative">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'phone' || formData.phone
                      ? 'text-emerald-600'
                      : 'text-emerald-400'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur"
                  placeholder=" "
                />
                <label
                  className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                    focusedField === 'phone' || formData.phone
                      ? 'top-1 text-xs text-emerald-600'
                      : 'top-1/2 -translate-y-1/2 text-emerald-500'
                  }`}
                >
                  Phone Number
                </label>
              </div>
            )}

            {/* Address (register vendor only) */}
            {mode === 'register' && role === 'vendor' && (
              <div className="relative">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'address' || formData.address
                      ? 'text-emerald-600'
                      : 'text-emerald-400'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  onFocus={() => setFocusedField('address')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur"
                  placeholder=" "
                />
                <label
                  className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                    focusedField === 'address' || formData.address
                      ? 'top-1 text-xs text-emerald-600'
                      : 'top-1/2 -translate-y-1/2 text-emerald-500'
                  }`}
                >
                  Restaurant Address
                </label>
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'password' || formData.password
                    ? 'text-emerald-600'
                    : 'text-emerald-400'
                }`}
              >
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur"
                placeholder=" "
              />
              <label
                className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                  focusedField === 'password' || formData.password
                    ? 'top-1 text-xs text-emerald-600'
                    : 'top-1/2 -translate-y-1/2 text-emerald-500'
                }`}
              >
                Password
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          {mode === 'login' && (
            <div className="mt-6 text-center">
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors">
                Forgot Password?
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}