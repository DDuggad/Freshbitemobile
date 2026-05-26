import fallbackDealsData from '../../imports/food-deals.json';

const API_BASE_URL = 'https://freshbite.onrender.com';

async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, options);
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
  dealStartTime?: string;
  dealEndTime?: string;
}

// ─── Authentication ───
//
// Backend schema (from server/routes/auth.js):
//   POST /api/auth/login    body: { email, password }
//   POST /api/auth/register body: { username, email, password }
//   PUT  /api/auth/profile  Bearer token, body: { restaurantName, location, address,
//                                                  phoneNumber, restaurantImage, googleMapsLocation }
// All success responses: { message, token?, user: { id, username, email, role,
//   profileCompleted, restaurantName, location, address, phoneNumber,
//   restaurantImage, googleMapsLocation } }
//
async function parseAuthResponse(
  response: Response,
  fallbackError: string
): Promise<{ token: string; user: VendorInfo }> {
  const text = await response.text();
  let body: any = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { message: text };
  }

  if (!response.ok) {
    const validationMsg = Array.isArray(body?.errors) && body.errors[0]?.msg;
    throw new Error(body?.message || validationMsg || `${fallbackError} (${response.status})`);
  }

  const u = body.user || body.vendor || {};
  const user: VendorInfo = {
    _id: u.id || u._id,
    id: u.id || u._id,
    username: u.username,
    email: u.email,
    restaurantName: u.restaurantName,
    location: u.location,
    address: u.address,
    phone: u.phoneNumber || u.phone,
    phoneNumber: u.phoneNumber,
    restaurantImage: u.restaurantImage,
    imageUrl: u.restaurantImage,
    googleMapsLocation: u.googleMapsLocation,
    googleMapsLink: u.googleMapsLocation,
    role: u.role,
    profileCompleted: u.profileCompleted,
  } as any;

  return { token: body.token, user };
}

export async function vendorLogin(
  data: VendorLoginData
): Promise<{ token: string; user: VendorInfo }> {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  return parseAuthResponse(response, 'Login failed');
}

export async function vendorSignup(
  data: VendorSignupData
): Promise<{ token: string; user: VendorInfo }> {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  return parseAuthResponse(response, 'Signup failed');
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

    let deals: any[] = [];
    if (Array.isArray(data)) {
      deals = data;
    } else if (data && typeof data === 'object') {
      deals = data.deals || data.data || data.results || data.items || [];
      if (deals.length === 0 && (data._id || data.id)) {
        deals = [data];
      }
    }

    return deals.map(normalizeDeal);
  } catch (error) {
    console.warn('API fetch failed, using local fallback data:', error);
    const deals: any[] = Array.isArray(fallbackDealsData) ? fallbackDealsData : [];
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

// Get vendor deals by vendor id (public endpoint)
export async function getVendorDealsByVendorId(vendorId: string): Promise<NormalizedDeal[]> {
  const res = await apiFetch(`/api/deals/vendor/${vendorId}`);
  if (!res.ok) throw new Error(`Failed to fetch vendor deals: ${res.status}`);
  const data = await res.json();
  const list = Array.isArray(data) ? data : (data.deals || data.data?.deals || []);
  return list.map(normalizeDeal);
}

// ─── Strict-payload helpers (mirror exact MERN backend shapes) ───

export interface CreateDealPayload {
  itemName: string;
  description: string;
  originalPrice: number;
  newPrice: number;
  stockAvailable: number;
  foodType: string;
  dealStartTime: string; // ISO 8601
  dealEndTime: string;   // ISO 8601
  image: string;
}

export async function createDealStrict(payload: CreateDealPayload, token: string) {
  const res = await apiFetch('/api/deals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `Request failed (${res.status})` }));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export interface ProfileUpdatePayload {
  restaurantName: string;
  location: string;
  address: string;
  phoneNumber: string;
  restaurantImage?: string;
  googleMapsLocation?: string;
}

export async function updateVendorProfileStrict(payload: ProfileUpdatePayload, token: string) {
  const res = await apiFetch('/api/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `Profile update failed (${res.status})` }));
    throw new Error(err.message || `Profile update failed (${res.status})`);
  }
  return res.json();
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