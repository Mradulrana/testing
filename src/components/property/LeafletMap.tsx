'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// =========================
// FIX LEAFLET ICONS
// =========================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// =========================
// TYPES
// =========================

interface Props {
  markerPos: L.LatLngExpression | null;

  defaultCenter: L.LatLngTuple;

  setMarkerPos: (pos: any) => void;

  reverseGeocode: (
    lat: number,
    lng: number
  ) => Promise<void>;

  handleMarkerDragEnd: (e: any) => void;
}

// =========================
// MAP EVENTS
// =========================

function MapEvents({
  setMarkerPos,
  reverseGeocode,
}: any) {
  useMapEvents({
    click(e) {
      setMarkerPos(e.latlng);

      reverseGeocode(
        e.latlng.lat,
        e.latlng.lng
      );
    },
  });

  return null;
}

// =========================
// CHANGE VIEW
// =========================

function ChangeView({
  center,
}: {
  center: L.LatLngExpression;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

// =========================
// MAIN MAP
// =========================

export default function LeafletMap({
  markerPos,
  defaultCenter,
  setMarkerPos,
  reverseGeocode,
  handleMarkerDragEnd,
}: Props) {
  return (
    <MapContainer
      center={markerPos || defaultCenter}
      zoom={12}
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markerPos && (
        <>
          <ChangeView center={markerPos} />

          <Marker
            position={markerPos}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
          />
        </>
      )}

      <MapEvents
        setMarkerPos={setMarkerPos}
        reverseGeocode={reverseGeocode}
      />
    </MapContainer>
  );
}