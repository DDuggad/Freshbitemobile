import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { vendorLogin } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

export function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showColdStartMsg, setShowColdStartMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      setShowColdStartMsg(false);
      return;
    }
    const t = setTimeout(() => setShowColdStartMsg(true), 5000);
    return () => clearTimeout(t);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await vendorLogin({ email, password });
      const user = response.user || (response as any).vendor;
      login(response.token, user);
      navigate('/vendor');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Invalid credentials or server error.'
      );
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <div
            role="alert"
            className="rounded-2xl px-4 py-3 border border-red-200 bg-red-50 text-red-600"
          >
            <strong>{error}</strong>
          </div>
        )}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <strong>Logging in...</strong>
              </>
            ) : (
              <strong>Login</strong>
            )}
          </button>
          {showColdStartMsg && (
            <p className="text-center text-gray-500" style={{ fontSize: '12px' }}>
              Waking up the server, this might take a moment...
            </p>
          )}
        </div>

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
