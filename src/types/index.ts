export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  pricePerSqFt: number;
  area: number; // in sq ft
  type: 'Apartment' | 'House' | 'Villa' | 'Plot' | 'Commercial';
  status: 'Buy' | 'Rent' | 'Commercial';
  location: {
    city: string;
    neighborhood: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    parking?: number;
    furnishing?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  };
  images: string[];
  videoUrl?: string;
  isVerified: boolean;
  agent: {
    id: string;
    name: string;
    company: string;
    phone: string;
  };
  description: string;
  amenities: string[];
  createdAt: string;
}

export interface Lead {
  id: string;
  propertyId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}
