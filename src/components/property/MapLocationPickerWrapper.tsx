'use client';

import dynamic from 'next/dynamic';

const MapLocationPicker = dynamic(() => import('./MapLocationPicker'), {
  ssr: false,
  loading: () => <div style={{height: '300px', width: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading map...</div>
});

export default MapLocationPicker;
