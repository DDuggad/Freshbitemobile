import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Loader2, Leaf, Upload, ArrowLeft } from 'lucide-react';
import { createDeal, updateDeal, getVendorDeals } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function AddDealPage() {
  const { token, vendor } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    expiresAt: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingDeal, setLoadingDeal] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isEdit || !token) return;
    (async () => {
      try {
        const deals = await getVendorDeals(token);
        const found = deals.find((d) => d.id === id);
        if (found) {
          setFormData({
            title: found.title,
            description: found.description,
            originalPrice: String(found.originalPrice),
            discountedPrice: String(found.currentPrice),
            expiresAt: found.expiresAt ? new Date(found.expiresAt).toISOString().slice(0, 16) : '',
            imageUrl: found.imageUrl || '',
          });
        } else {
          setError('Deal not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load deal.');
      } finally {
        setLoadingDeal(false);
      }
    })();
  }, [isEdit, id, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, imageUrl: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setLoading(true);

    try {
      const payload = {
        itemName: formData.title,
        description: formData.description,
        originalPrice: parseFloat(formData.originalPrice),
        newPrice: parseFloat(formData.discountedPrice),
        stockAvailable: 10,
        imageUrl: formData.imageUrl || undefined,
        isVeg: true,
        foodType: 'veg',
        location: vendor?.location || vendor?.address || undefined,
        expiresAt: formData.expiresAt || undefined,
      };

      if (isEdit && id) {
        await updateDeal(id, payload, token);
      } else {
        await createDeal(payload, token);
      }
      setSuccess(true);
      setTimeout(() => navigate('/vendor'), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save deal.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDeal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#10B981]" size={32} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center mb-4 shadow-lg">
          <Leaf className="text-white" size={32} />
        </div>
        <h2 className="text-xl text-[#064e3b] mb-2">{isEdit ? 'Deal Updated!' : 'Deal Published!'}</h2>
        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/vendor')}
            className="w-10 h-10 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-xl text-white">{isEdit ? 'Edit Deal' : 'Add New Deal'}</h1>
            <p className="text-xs text-white/60">{isEdit ? 'Update your deal' : 'Create an exciting deal'}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="glass-card rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm text-[#064e3b] mb-2">Deal Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Masala Dosa Combo"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-[#064e3b] mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your deal..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] text-sm resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-[#064e3b] mb-2">Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-[#10B981] transition-all"
            >
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Upload className="text-gray-400" size={24} />
                  <p className="text-sm text-gray-500">Tap to upload image</p>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-sm text-[#064e3b] mb-2">Original Price (₹)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="499"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-[#064e3b] mb-2">Discounted Price (₹)</label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="149"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-[#064e3b] mb-2">Expiry Time</label>
            <input
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] text-sm transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              {isEdit ? 'Saving...' : 'Publishing...'}
            </>
          ) : (
            <span>{isEdit ? 'Save Changes' : 'Publish Deal'}</span>
          )}
        </button>
      </form>
    </div>
  );
}
