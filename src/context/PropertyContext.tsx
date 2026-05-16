'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { supabase } from '@/lib/supabaseClient';
import { Property } from '@/types';

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Property) => Promise<void>;
  loading: boolean;
}

const PropertyContext =
  createContext<PropertyContextType | null>(null);

export function PropertyProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH PROPERTIES
  // =========================

  const fetchProperties = async () => {

    const { data, error } =
      await supabase
        .from('properties')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const mappedProperties: Property[] =
      data.map((item: any) => ({
        id: item.id.toString(),

        title:
          item.title || 'Untitled Property',

        price:
          Number(item.price) || 0,

        currency:
          item.currency || '₹',

        pricePerSqFt:
          Number(item.price_per_sqft) || 0,

        area:
          Number(item.area_size) || 0,

        type:
          item.property_type || 'House',

        status:
          item.status || 'Buy',

        location: {
          city:
            item.location || '',

          neighborhood:
            item.neighborhood || '',

          address:
            item.address || '',
        },

        features: {
          bedrooms:
            item.bedrooms || 0,

          bathrooms:
            item.bathrooms || 0,

          furnishing:
            item.furnishing ||
            'Unfurnished',
        },

        images:
          item.images?.length
            ? item.images
            : [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
              ],

        videoUrl:
          item.video_url || '',

        isVerified:
          item.is_verified || false,

        agent: {
          id:
            item.owner_id || 'owner',

          name:
            item.agent_name || 'Owner',

          company:
            item.agent_company ||
            'ZameenMarket',

          phone:
            item.agent_phone || '',
        },

        description:
          item.description ||
          'No description available.',

        amenities:
          item.amenities || [],

        createdAt:
          item.created_at,
      }));

    setProperties(mappedProperties);
    setLoading(false);
  };

  // =========================
  // ADD PROPERTY
  // =========================

  const addProperty = async (
    property: Property
  ) => {

    const { error } =
      await supabase
        .from('properties')
        .insert([
          {
            title: property.title,

            description:
              property.description,

            price: property.price,

            location:
              property.location.city,

            neighborhood:
              property.location.neighborhood,

            address:
              property.location.address,

            area_size:
              property.area,

            property_type:
              property.type,

            currency:
              property.currency,

            price_per_sqft:
              property.pricePerSqFt,

            status:
              property.status,

            bedrooms:
              property.features
                ?.bedrooms || 0,

            bathrooms:
              property.features
                ?.bathrooms || 0,

            furnishing:
              property.features
                ?.furnishing ||
              'Unfurnished',

            images:
              property.images || [],

            is_verified:
              property.isVerified || false,

            agent_name:
              property.agent?.name ||
              'Owner',

            agent_company:
              property.agent?.company ||
              'ZameenMarket',

            agent_phone:
              property.agent?.phone ||
              '',

            amenities:
              property.amenities || [],

            video_url:
              property.videoUrl || '',
          },
        ]);

    if (error) {
      console.error(error);
      return;
    }

    await fetchProperties();
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        loading,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {

  const context =
    useContext(PropertyContext);

  if (!context) {
    throw new Error(
      'useProperties must be used inside PropertyProvider'
    );
  }

  return context;
}