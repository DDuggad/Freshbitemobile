import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createDealStrict, updateDeal, getVendorDealsByVendorId, NewDealData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

const FOOD_TYPES = [
  'Pure Veg',
  'South Indian',
  'North Indian',
  'Italian',
  'Chinese',
  'Continental',
  'Multi-Cuisine',
];

export function AddDealPage() {
  const { token, vendor } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    itemName: '',
    foodType: '',
    description: '',
    originalPrice: '',
    dealPrice: '',
    stockAvailable: '',
    dealStartTime: '',
    dealEndTime: '',
    imageUrl: '',
  });
  const [loadingDeal, setLoadingDeal] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit || !token || !vendor?.id) {
      if (isEdit && !vendor?.id) setLoadingDeal(false);
      return;
    }
    (async () => {
      try {
        const deals = await getVendorDealsByVendorId(vendor.id);
        const found = deals.find((d) => d.id === id);
        if (found) {
          setFormData({
            itemName: found.title,
            foodType: found.foodType || '',
            description: found.description || '',
            originalPrice: String(found.originalPrice || ''),
            dealPrice: String(found.currentPrice || ''),
            stockAvailable: String(found.stockAvailable || ''),
            dealStartTime: '',
            dealEndTime: found.validUntil || found.expiresAt || '',
            imageUrl: found.imageUrl || '',
          });
        }
      } catch {
        // silent
      } finally {
        setLoadingDeal(false);
      }
    })();
  }, [isEdit, id, token, vendor?.id]);

  const update = (k: string, v: string) =>
    setFormData((prev) => ({ ...prev, [k]: v }));

  const orig = parseFloat(formData.originalPrice) || 0;
  const dealP = parseFloat(formData.dealPrice) || 0;
  const discountPct =
    orig > 0 && dealP > 0 && dealP <= orig
      ? Math.round((1 - dealP / orig) * 100)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isEdit) {
      const editPayload: NewDealData = {
        itemName: formData.itemName,
        foodType: formData.foodType,
        description: formData.description,
        originalPrice: orig,
        newPrice: dealP,
        stockAvailable: parseInt(formData.stockAvailable) || 0,
        imageUrl: formData.imageUrl || undefined,
        dealStartTime: formData.dealStartTime || undefined,
        dealEndTime: formData.dealEndTime || undefined,
      };
      try {
        if (id && token) {
          await updateDeal(id, editPayload, token);
        }
        navigate('/vendor');
      } catch (err) {
        alert((err as Error).message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const payload = {
      itemName: formData.itemName,
      description: formData.description,
      originalPrice: Number(formData.originalPrice),
      newPrice: Number(formData.dealPrice),
      stockAvailable: Number(formData.stockAvailable),
      foodType: formData.foodType,
      dealStartTime: new Date(formData.dealStartTime).toISOString(),
      dealEndTime: new Date(formData.dealEndTime).toISOString(),
      image: formData.imageUrl,
    };

    try {
      await createDealStrict(payload, token!);
      navigate('/vendor');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDeal) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen pb-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="sticky top-0 z-40 glass-dark px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/vendor')}
            className="w-10 h-10 bg-white/15 hover:bg-white/25 rounded-xl flex items-center justify-center border border-white/10"
            aria-label="Back"
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
              <strong>Item Name*</strong>
            </label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => update('itemName', e.target.value)}
              required
              placeholder="e.g., Masala Dosa Combo"
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#064e3b] mb-2">
              <strong>Food Type*</strong>
            </label>
            <select
              value={formData.foodType}
              onChange={(e) => update('foodType', e.target.value)}
              required
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] bg-white transition-all"
            >
              <option value="">Select food type</option>
              {FOOD_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#064e3b] mb-2">
              <strong>Description</strong>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => update('description', e.target.value)}
              rows={4}
              placeholder="Describe your deal..."
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Original Price (₹)*</strong>
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => update('originalPrice', e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="499"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>
            <div>
              <label className="block text-[#064e3b] mb-2">
                <strong>Deal Price (₹)*</strong>
              </label>
              <input
                type="number"
                value={formData.dealPrice}
                onChange={(e) => update('dealPrice', e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="149"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
              />
            </div>
          </div>

          <div
            className="rounded-full px-4 py-3 inline-flex items-center"
            style={{ background: 'rgba(76, 175, 80, 0.12)', color: '#4CAF50' }}
          >
            <strong>Discount: {discountPct}%</strong>
          </div>

          <div>
            <label className="block text-[#064e3b] mb-2">
              <strong>Stock Available*</strong>
            </label>
            <input
              type="number"
              value={formData.stockAvailable}
              onChange={(e) => update('stockAvailable', e.target.value)}
              required
              min="0"
              placeholder="10"
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#064e3b] mb-2">
              <strong>Deal Start Time*</strong>
            </label>
            <input
              type="datetime-local"
              value={formData.dealStartTime}
              onChange={(e) => update('dealStartTime', e.target.value)}
              required
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#064e3b] mb-2">
              <strong>Deal End Time*</strong>
            </label>
            <input
              type="datetime-local"
              value={formData.dealEndTime}
              onChange={(e) => update('dealEndTime', e.target.value)}
              required
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#064e3b] mb-2">
              <strong>Image URL</strong>
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#10B981] text-[#064e3b] transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <strong>Publishing...</strong>
            </>
          ) : (
            <strong>{isEdit ? 'Save Changes' : 'Publish Deal'}</strong>
          )}
        </button>
      </form>
    </div>
  );
}
