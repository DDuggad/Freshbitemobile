import fallbackDealsData from '../../imports/food-deals.json';

const API_BASE_URL = 'https://freshbite.onrender.com';

// ─── CORS Proxy Helper ───
// The backend may not include this preview origin in its Access-Control-Allow-Origin header,
// so we route requests through a public CORS proxy.
// We try multiple proxies as fallbacks since any single one may be unreliable.

const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

let workingProxyIndex = 0;

// Track whether direct fetch has worked in this session. Preview/sandbox
// environments routinely block cross-origin direct requests, so after the first
// failure we skip straight to proxies and avoid noisy console warnings.
let directFetchBlocked = false;

async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const targetUrl = `${API_BASE_URL}${path}`;

  // 1. Try direct fetch first (unless we already know it's blocked)
  if (!directFetchBlocked) {
    try {
      const res = await fetch(targetUrl, options);
      if (res.ok) return res;
      // Non-ok direct response — still return it; caller decides
      return res;
    } catch {
      directFetchBlocked = true;
    }
  }

  // 2. Try proxies, starting from the last one that worked
  const proxyOrder = [
    ...CORS_PROXIES.slice(workingProxyIndex),
    ...CORS_PROXIES.slice(0, workingProxyIndex),
  ];

  let lastResponse: Response | null = null;
  for (let i = 0; i < proxyOrder.length; i++) {
    const makeUrl = proxyOrder[i];
    const proxiedUrl = makeUrl(targetUrl);
    try {
      const res = await fetch(proxiedUrl, {
        ...options,
        headers: options?.method && options.method !== 'GET' ? options.headers : undefined,
      });
      if (res.ok) {
        workingProxyIndex = CORS_PROXIES.indexOf(proxyOrder[i]);
        return res;
      }
      lastResponse = res;
    } catch {
      // Network-level failure on this proxy — try the next one silently
    }
  }

  if (lastResponse) return lastResponse;
  throw new TypeError(`Network unavailable: could not reach ${path}`);
}

// ─── Interfaces ───

export interface Deal {
  _id?: string;
  id: string;
  title?: string;
  itemName?: string;
  vendor?: string;
  vendorId?: string;
  location: string;
  currentPrice?: number;
  newPrice?: number;
  originalPrice: number;
  discount?: number;
  imageUrl?: string;
  image?: string;
  isVeg?: boolean;
  isJain?: boolean;
  foodType?: string;
  stockAvailable?: number;
  pickupTime?: string;
  active?: boolean;
  createdAt?: string;
}

export interface NormalizedDeal {
  id: string;
  title: string;
  vendor: string;
  vendorId: string;
  location: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  imageUrl: string;
  isVeg: boolean;
  isJain: boolean;
  foodType: string;
  stockAvailable: number;
  pickupTime: string;
  active: boolean;
  description: string;
  expiresAt: string;
  validUntil: string;
  vendorPhone: string;
  vendorAddress: string;
  googleMapsLink: string;
}

export function normalizeDeal(deal: any): NormalizedDeal {
  const id = deal._id || deal.id || '';
  const title = deal.title || deal.itemName || deal.name || deal.item_name || deal.dealName || 'Untitled Deal';
  const currentPrice = deal.currentPrice ?? deal.newPrice ?? deal.new_price ?? deal.discountedPrice ?? deal.price ?? 0;
  const originalPrice = deal.originalPrice ?? deal.original_price ?? deal.mrp ?? deal.actualPrice ?? 0;
  const discount = deal.discount ?? deal.discountPercentage ?? (originalPrice > 0 ? Math.round((1 - currentPrice / originalPrice) * 100) : 0);
  const imageUrl = deal.imageUrl || deal.image || deal.imageURL || deal.img || deal.photo || '';
  const foodType = deal.foodType || deal.food_type || deal.category || 'veg';

  // Determine veg/jain from foodType string
  const foodTypeLower = foodType.toLowerCase();
  const isVeg = deal.isVeg ?? deal.is_veg ?? (foodTypeLower.includes('veg') || foodTypeLower.includes('jain') || foodTypeLower === 'south indian' || foodTypeLower === 'north indian' || foodTypeLower === 'italian' || foodTypeLower === 'chinese' || foodTypeLower === 'continental');
  const isJain = deal.isJain ?? deal.is_jain ?? foodTypeLower.includes('jain');

  // Handle vendor as object or string
  let vendorName = 'Local Vendor';
  let vendorId = deal.vendorId || deal.vendor_id || deal.vendorID || '';
  let vendorPhone = deal.vendorPhone || deal.phone || deal.phoneNumber || '';
  let vendorAddress = deal.vendorAddress || deal.address || '';
  let googleMapsLink = deal.googleMapsLink || deal.mapsLink || deal.googleMapsLocation || '';
  if (deal.vendor && typeof deal.vendor === 'object') {
    vendorName = deal.vendor.restaurantName || deal.vendor.name || deal.vendor.businessName || 'Local Vendor';
    vendorId = vendorId || deal.vendor._id || deal.vendor.id || '';
    vendorPhone = vendorPhone || deal.vendor.phone || deal.vendor.phoneNumber || '';
    vendorAddress = vendorAddress || deal.vendor.address || '';
    googleMapsLink = googleMapsLink || deal.vendor.googleMapsLink || deal.vendor.googleMapsLocation || '';
  } else if (typeof deal.vendor === 'string') {
    vendorName = deal.vendor;
  } else if (deal.vendorName || deal.vendor_name || deal.restaurantName || deal.restaurant) {
    vendorName = deal.vendorName || deal.vendor_name || deal.restaurantName || deal.restaurant;
  }

  // Location: from deal directly or from vendor object
  const location = deal.location || (deal.vendor && typeof deal.vendor === 'object' ? deal.vendor.location : '') || deal.area || deal.city || '';

  const stockAvailable = deal.availableStock ?? deal.stockAvailable ?? deal.stock_available ?? deal.stock ?? deal.quantity ?? 10;
  const pickupTime = deal.pickupTime || deal.pickup_time || deal.pickupWindow || 'Today, 5:00 PM - 8:00 PM';
  const active = deal.active ?? deal.isActive ?? true;

  return {
    id,
    title,
    vendor: vendorName,
    vendorId,
    location,
    currentPrice,
    originalPrice,
    discount,
    imageUrl,
    isVeg,
    isJain,
    foodType,
    stockAvailable,
    pickupTime,
    active,
    description: deal.description || deal.desc || '',
    expiresAt: deal.expiresAt || deal.expiryTime || deal.expiry || deal.dealEndTime || deal.validUntil || '',
    validUntil: deal.validUntil || deal.valid_until || deal.dealEndTime || deal.expiresAt || deal.expiryTime || deal.expiry || '',
    vendorPhone,
    vendorAddress,
    googleMapsLink,
  };
}

export interface VendorLoginData {
  email: string;
  password: string;
}

export interface VendorSignupData {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
  address?: string;
  location?: string;
  phone?: string;
}

export interface VendorProfileData {
  restaurantName: string;
  location: string;
  address: string;
  phone: string;
  googleMapsLink?: string;
}

export interface VendorInfo {
  _id: string;
  name: string;
  email: string;
  restaurantName: string;
  location: string;
  address: string;
  phone: string;
  googleMapsLink?: string;
  profileCompleted: boolean;
  rating?: number;
}

export interface NewDealData {
  itemName: string;
  originalPrice: number;
  newPrice: number;
  stockAvailable: number;
  imageUrl?: string;
  isVeg?: boolean;
  isJain?: boolean;
  foodType?: string;
  location?: string;
  pickupTime?: string;
  description?: string;
  expiresAt?: string;
}

// ─── Authentication ───

export async function vendorLogin(data: VendorLoginData): Promise<{ token: string; user: VendorInfo }> {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  const result = await response.json();
  console.log('Login response:', result);
  return {
    token: result.token,
    user: result.user || result.vendor || result.data || result,
  };
}

export async function vendorSignup(data: VendorSignupData): Promise<{ token: string; user: VendorInfo }> {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Signup failed' }));
    throw new Error(error.message || 'Signup failed');
  }

  const result = await response.json();
  console.log('Signup response:', result);
  return {
    token: result.token,
    user: result.user || result.vendor || result.data || result,
  };
}

export async function updateVendorProfile(data: VendorProfileData, token: string): Promise<VendorInfo> {
  const response = await apiFetch('/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Profile update failed' }));
    throw new Error(error.message || 'Profile update failed');
  }

  return await response.json();
}

// ─── Deals ───

export async function getDeals(params?: {
  location?: string;
  foodType?: string;
  search?: string;
}): Promise<NormalizedDeal[]> {
  try {
    let path = '/api/deals';
    const searchParams = new URLSearchParams();
    if (params?.location) searchParams.set('location', params.location);
    if (params?.foodType) searchParams.set('foodType', params.foodType);
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    if (qs) path += `?${qs}`;

    const response = await apiFetch(path);
    if (!response.ok) throw new Error(`Failed to fetch deals: ${response.status}`);

    const data = await response.json();
    console.log('API /api/deals raw response:', data);

    let deals: any[] = [];
    if (Array.isArray(data)) {
      deals = data;
    } else if (data && typeof data === 'object') {
      deals = data.deals || data.data || data.results || data.items || [];
      if (deals.length === 0 && (data._id || data.id)) {
        deals = [data];
      }
    }

    console.log(`Parsed ${deals.length} deals from API`);
    return deals.map(normalizeDeal);
  } catch (error) {
    console.warn('API fetch failed, using local fallback data:', error);
    // Fall back to bundled JSON snapshot of /api/deals
    const deals: any[] = Array.isArray(fallbackDealsData) ? fallbackDealsData : [];
    console.log(`Loaded ${deals.length} deals from local fallback`);
    return deals.map(normalizeDeal);
  }
}

export async function claimDeal(dealId: string, token?: string): Promise<{ message: string; stockRemaining?: number }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await apiFetch(`/api/deals/${dealId}/claim`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to claim deal' }));
    throw new Error(error.message || 'Failed to claim deal');
  }

  return await response.json();
}

export async function createDeal(dealData: NewDealData, token: string): Promise<Deal> {
  const response = await apiFetch('/api/deals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dealData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create deal' }));
    throw new Error(error.message || 'Failed to create deal');
  }

  return await response.json();
}

export async function updateDeal(dealId: string, dealData: Partial<NewDealData & { active?: boolean }>, token: string): Promise<Deal> {
  const response = await apiFetch(`/api/deals/${dealId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dealData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update deal' }));
    throw new Error(error.message || 'Failed to update deal');
  }

  return await response.json();
}

export async function deleteDeal(dealId: string, token: string): Promise<void> {
  const response = await apiFetch(`/api/deals/${dealId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to delete deal' }));
    throw new Error(error.message || 'Failed to delete deal');
  }
}

// Get vendor deals (requires authentication)
export async function getVendorDeals(token: string): Promise<NormalizedDeal[]> {
  const response = await apiFetch('/api/vendor/deals', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch vendor deals');

  const data = await response.json();
  const deals: Deal[] = Array.isArray(data) ? data : data.deals || [];
  return deals.map(normalizeDeal);
}

// ─── Vendors ───

export async function getVendors(): Promise<VendorInfo[]> {
  try {
    const response = await apiFetch('/api/vendors');
    if (!response.ok) throw new Error('Failed to fetch vendors');
    const data = await response.json();
    return Array.isArray(data) ? data : data.vendors || [];
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
}

export async function getVendorById(vendorId: string): Promise<VendorInfo | null> {
  try {
    const response = await apiFetch(`/api/vendors/${vendorId}`);
    if (!response.ok) throw new Error('Failed to fetch vendor');
    return await response.json();
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return null;
  }
}