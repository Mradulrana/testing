'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import dynamic from 'next/dynamic';

import L from 'leaflet';

import styles from './MapLocationPicker.module.css';

// =========================
// DYNAMIC IMPORT
// =========================

const LeafletMap = dynamic(
  () => import('./LeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
        }}
      >
        Loading map...
      </div>
    ),
  }
);

// =========================
// TYPES
// =========================

interface MapLocationPickerProps {
  onLocationChange: (location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    neighborhood: string;
    pincode: string;
  }) => void;
}

// =========================
// COMPONENT
// =========================

export default function MapLocationPicker({
  onLocationChange,
}: MapLocationPickerProps) {
  const [mounted, setMounted] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [markerPos, setMarkerPos] =
    useState<L.LatLngExpression | null>(
      null
    );

  const defaultCenter: L.LatLngTuple = [
    23.2599,
    77.4126,
  ];

  // =========================
  // PREVENT HYDRATION ISSUES
  // =========================

  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================
  // REVERSE GEOCODE
  // =========================

  const reverseGeocode = async (
    lat: number,
    lon: number
  ) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );

      const data = await response.json();

      if (data && data.address) {
        onLocationChange({
          lat,
          lng: lon,
          address: data.display_name || '',
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            '',
          neighborhood:
            data.address.suburb ||
            data.address.neighbourhood ||
            '',
          pincode:
            data.address.postcode || '',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // SEARCH LOCATION
  // =========================

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Madhya Pradesh'
        )}&limit=1`
      );

      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];

        const newPos: L.LatLngTuple = [
          parseFloat(result.lat),
          parseFloat(result.lon),
        ];

        setMarkerPos(newPos);

        reverseGeocode(
          newPos[0],
          newPos[1]
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // MARKER DRAG
  // =========================

  const handleMarkerDragEnd = (
    e: any
  ) => {
    const marker = e.target;

    const position = marker.getLatLng();

    setMarkerPos(position);

    reverseGeocode(
      position.lat,
      position.lng
    );
  };

  if (!mounted) return null;

  return (
    <div>
      <div
        className={styles.searchContainer}
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <input
          type="text"
          placeholder="Search location..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            handleSearch()
          }
        />

        <button
          type="button"
          onClick={handleSearch}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            background: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      <div className={styles.mapContainer}>
        <LeafletMap
          markerPos={markerPos}
          defaultCenter={defaultCenter}
          setMarkerPos={setMarkerPos}
          reverseGeocode={reverseGeocode}
          handleMarkerDragEnd={
            handleMarkerDragEnd
          }
        />
      </div>

      <p
        style={{
          fontSize: '0.75rem',
          color: '#6b7280',
          marginTop: '0.5rem',
        }}
      >
        Click anywhere on map to select
        location
      </p>
    </div>
  );
}