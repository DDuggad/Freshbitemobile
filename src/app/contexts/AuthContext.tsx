import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Vendor {
  id: string;
  _id?: string;
  name: string;
  email: string;
  restaurantName: string;
  businessName?: string;
  location: string;
  address?: string;
  phone?: string;
  googleMapsLink?: string;
  profileCompleted: boolean;
}

interface AuthContextType {
  vendor: Vendor | null;
  token: string | null;
  login: (token: string, vendor: Vendor) => void;
  logout: () => void;
  updateVendor: (vendor: Vendor) => void;
  isAuthenticated: boolean;
  needsProfileSetup: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('vendorToken');
    const savedVendor = localStorage.getItem('vendorData');

    if (savedToken && savedVendor) {
      try {
        setToken(savedToken);
        setVendor(JSON.parse(savedVendor));
      } catch {
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorData');
      }
    }
  }, []);

  const login = useCallback((newToken: string, vendorData: any) => {
    // Normalize the vendor object from various backend response shapes
    const normalized: Vendor = {
      id: vendorData._id || vendorData.id || '',
      name: vendorData.name || '',
      email: vendorData.email || '',
      restaurantName: vendorData.restaurantName || vendorData.businessName || '',
      businessName: vendorData.restaurantName || vendorData.businessName || '',
      location: vendorData.location || '',
      address: vendorData.address || '',
      phone: vendorData.phone || '',
      googleMapsLink: vendorData.googleMapsLink || '',
      profileCompleted: vendorData.profileCompleted ?? false,
    };

    setToken(newToken);
    setVendor(normalized);
    localStorage.setItem('vendorToken', newToken);
    localStorage.setItem('vendorData', JSON.stringify(normalized));
  }, []);

  const updateVendor = useCallback((updatedVendor: Vendor) => {
    setVendor(updatedVendor);
    localStorage.setItem('vendorData', JSON.stringify(updatedVendor));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setVendor(null);
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
  }, []);

  const needsProfileSetup = !!vendor && !vendor.profileCompleted;

  return (
    <AuthContext.Provider
      value={{
        vendor,
        token,
        login,
        logout,
        updateVendor,
        isAuthenticated: !!token,
        needsProfileSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
