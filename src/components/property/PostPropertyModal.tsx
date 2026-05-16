import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Property } from '@/types';
import styles from './PostPropertyModal.module.css';
import MapLocationPicker from './MapLocationPickerWrapper';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (property: Property) => void;
}

export default function PostPropertyModal({ isOpen, onClose, onSubmit }: PostPropertyModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [manualVideo, setManualVideo] = useState<File | null>(null);

  const [category, setCategory] = useState<'Buy' | 'Rent' | 'Commercial'>('Buy');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [manualImages, setManualImages] = useState<File[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationNeighborhood, setLocationNeighborhood] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [bhk, setBhk] = useState('');

  // Calculator states
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [pricePerSqFt, setPricePerSqFt] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Recalculate price when area or pricePerSqFt changes
  React.useEffect(() => {
    const a = Number(area);
    const ppsf = Number(pricePerSqFt);
    if (a > 0 && ppsf > 0) {
      setPrice((a * ppsf).toString());
    }
  }, [area, pricePerSqFt]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setManualImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setManualVideo(e.target.files[0]);
    }
  };

  const removeManualImage = (index: number) => {
    setManualImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMapLocationChange = (loc: any) => {
    setLatLng({ lat: loc.lat, lng: loc.lng });
    // Only auto-fill if the user hasn't typed anything manually yet, or overwrite if desired.
    // For this flow, we'll overwrite to show the geocoding works.
    if (loc.city) setLocationCity(loc.city);
    if (loc.neighborhood) setLocationNeighborhood(loc.neighborhood);
    if (loc.pincode) setPincode(loc.pincode);
    if (loc.address) setLandmark(loc.address); // Using landmark field to store full address context temporarily
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for numbers
    const numericPrice = Number(price);
    const numericArea = Number(area);
    const numericBhk = Number(bhk);

    if (isNaN(numericPrice) || isNaN(numericArea) || isNaN(numericBhk)) {
      alert("Price, Area, and BHK must be valid numbers.");
      return;
    }

    const newProperty: Property = {
      id: Math.random().toString(36).substr(2, 9), // Simple ID generator
      title: title || 'New Property',
      price: numericPrice,
      currency: '₹',
      pricePerSqFt: numericArea > 0 ? Math.round(numericPrice / numericArea) : 0,
      area: numericArea,
      type: category === 'Commercial' ? 'Commercial' : 'Apartment',
      status: category === 'Rent' ? 'Rent' : 'Buy', // Commercial maps to Buy by default to satisfy type
      location: {
        city: locationCity || 'Unknown',
        neighborhood: locationNeighborhood || 'Unknown',
        address: `${plotNumber ? plotNumber + ', ' : ''}${locationNeighborhood}${landmark ? ' (' + landmark + ')' : ''}, ${locationCity}${pincode ? ' - ' + pincode : ''}`,
        coordinates: latLng ? { lat: latLng.lat, lng: latLng.lng } : undefined,
      },
      features: {
        bedrooms: numericBhk,
        bathrooms: numericBhk > 0 ? numericBhk : 1, // Defaulting bathrooms based on BHK for mock
      },
      // Combine URL image with manual images (using object URLs for mock)
      images: [
        imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ...manualImages.map(file => URL.createObjectURL(file))
      ],
      isVerified,
      agent: {
        id: 'user_agent',
        name: 'You (Agent)',
        company: 'ZameenMarket User',
        phone: '+91 XXXXXXXXXX',
      },
      description: 'A newly posted property on ZameenMarket.',
      amenities: [],
      createdAt: new Date().toISOString(),
    };

    onSubmit(newProperty);
    onClose();

    // Reset form
    setTitle('');
    setLength('');
    setBreadth('');
    setPricePerSqFt('');
    setImageUrl('');
    setManualImages([]);
    setVideoUrl('');
    setLocationCity('');
    setLocationNeighborhood('');
    setPlotNumber('');
    setLandmark('');
    setPincode('');
    setLatLng(null);
    setPrice('');
    setArea('');
    setBhk('');
    setIsVerified(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Post New Property</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.categoryGroup}>
            <input type="radio" id="cat-buy" name="category" value="Buy" checked={category === 'Buy'} onChange={() => setCategory('Buy')} className={styles.radioInput} />
            <label htmlFor="cat-buy" className={styles.radioLabel}>Buy</label>

            <input type="radio" id="cat-rent" name="category" value="Rent" checked={category === 'Rent'} onChange={() => setCategory('Rent')} className={styles.radioInput} />
            <label htmlFor="cat-rent" className={styles.radioLabel}>Rent</label>

            <input type="radio" id="cat-commercial" name="category" value="Commercial" checked={category === 'Commercial'} onChange={() => setCategory('Commercial')} className={styles.radioInput} />
            <label htmlFor="cat-commercial" className={styles.radioLabel}>Commercial</label>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Property Title</label>
            <input type="text" className={styles.input} value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Luxury 3 BHK Apartment" />
          </div>

          <div className={styles.mediaSection}>
            <h3 className={styles.sectionTitle}>Media</h3>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Image URL (Quick Mockup)</label>
              <input type="url" className={styles.input} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className={styles.mediaUploadRow}>
              <label className={styles.fileInputLabel}>
                Upload Images
                <input type="file" multiple accept="image/*" className={styles.hiddenInput} onChange={handleImageUpload} />
              </label>
              <span className={styles.helpText}>Supported formats: JPG, PNG, WEBP</span>
            </div>

            {manualImages.length > 0 && (
              <div className={styles.previewGallery}>
                {manualImages.map((file, idx) => (
                  <div key={idx} className={styles.previewImageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(file)} alt="preview" className={styles.previewImage} />
                    <button type="button" className={styles.removeImageBtn} onClick={() => removeManualImage(idx)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.videoInputWrapper}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Video Walk-through (URL)</label>
                <input type="url" className={styles.input} value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
              </div>

              <div className={styles.mediaUploadRow} style={{marginTop: '0.5rem'}}>
                <label className={styles.fileInputLabel}>
                  Upload MP4
                  <input type="file" accept="video/mp4" className={styles.hiddenInput} onChange={handleVideoUpload} />
                </label>
                <span className={styles.helpText}>{manualVideo ? manualVideo.name : 'Select a short walk-through video'}</span>
              </div>
            </div>
          </div>

          <div className={styles.mediaSection}>
            <h3 className={styles.sectionTitle}>Location Details</h3>

            <MapLocationPicker onLocationChange={handleMapLocationChange} />

            <div className={styles.row} style={{ marginTop: '1rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>City (Madhya Pradesh)</label>
                <select className={styles.input} value={locationCity} onChange={e => setLocationCity(e.target.value)} required>
                  <option value="">Select City</option>
                  <option value="Indore">Indore</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Jabalpur">Jabalpur</option>
                  <option value="Gwalior">Gwalior</option>
                  <option value="Ujjain">Ujjain</option>
                  <option value="Sagar">Sagar</option>
                  <option value="Rewa">Rewa</option>
                  <option value="Satna">Satna</option>
                  <option value="Ratlam">Ratlam</option>
                  <option value="Chhatarpur">Chhatarpur</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Pincode</label>
                <input type="text" className={`${styles.input} ${styles.readonlyInput}`} value={pincode} readOnly placeholder="e.g. 452001" />
              </div>
            </div>

            <div className={styles.row} style={{ marginTop: '1rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Plot/House Number</label>
                <input type="text" className={styles.input} value={plotNumber} onChange={e => setPlotNumber(e.target.value)} placeholder="e.g. 104, Block A" />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Street/Colony Name</label>
                <input type="text" className={styles.input} value={locationNeighborhood} onChange={e => setLocationNeighborhood(e.target.value)} required placeholder="e.g. Vijay Nagar" />
              </div>
            </div>

            <div className={styles.row} style={{ marginTop: '1rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Landmark</label>
                <input type="text" className={`${styles.input} ${styles.readonlyInput}`} value={landmark} readOnly placeholder="e.g. Opposite City Mall" />
              </div>
            </div>
          </div>

          <div className={styles.mediaSection}>
            <h3 className={styles.sectionTitle}>Smart Calculator (Area & Price)</h3>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Length (ft)</label>
                <input type="number" className={styles.input} value={length} onChange={e => {
                  setLength(e.target.value);
                  const l = Number(e.target.value);
                  const b = Number(breadth);
                  if (l > 0 && b > 0) setArea((l * b).toString());
                }} placeholder="e.g. 50" min="0" />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Breadth (ft)</label>
                <input type="number" className={styles.input} value={breadth} onChange={e => {
                  setBreadth(e.target.value);
                  const l = Number(length);
                  const b = Number(e.target.value);
                  if (l > 0 && b > 0) setArea((l * b).toString());
                }} placeholder="e.g. 30" min="0" />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Total Area (sq.ft.)</label>
                <input type="number" className={`${styles.input} ${length && breadth ? styles.readonlyInput : ''}`} value={area} onChange={e => setArea(e.target.value)} required placeholder="e.g. 1500" min="0" readOnly={!!(length && breadth)} />
              </div>
            </div>

            <div className={styles.row} style={{ marginTop: '1rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Price per Sq.Ft (₹)</label>
                <input type="number" className={styles.input} value={pricePerSqFt} onChange={e => {
                  setPricePerSqFt(e.target.value);
                  const ppsf = Number(e.target.value);
                  const a = Number(area);
                  if (ppsf > 0 && a > 0) setPrice((ppsf * a).toString());
                }} placeholder="e.g. 10000" min="0" />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Total Price (₹)</label>
                <input type="number" className={`${styles.input} ${pricePerSqFt && area ? styles.readonlyInput : ''}`} value={price} onChange={e => setPrice(e.target.value)} required placeholder="e.g. 15000000" min="0" readOnly={!!(pricePerSqFt && area)} />
              </div>
              {category !== 'Commercial' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>BHK</label>
                  <input type="number" className={styles.input} value={bhk} onChange={e => setBhk(e.target.value)} required placeholder="e.g. 3" min="0" />
                </div>
              )}
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" className={styles.checkbox} checked={isVerified} onChange={e => setIsVerified(e.target.checked)} />
            Show &quot;Verified&quot; Badge
          </label>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isUploading}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Post Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
