'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Maximize, BedDouble, Bath, Car, Check, Phone, Mail, Share2, Heart, Map as MapIcon } from 'lucide-react';
import { Property } from '@/types';
import styles from './PropertyDetail.module.css';

// Using mock data matching ID 1
const mockProperty: Property = {
  id: '1',
  title: 'Luxury 3 BHK Apartment in DLF Phase 5',
  price: 35000000,
  currency: '₹',
  pricePerSqFt: 18500,
  area: 1850,
  type: 'Apartment',
  status: 'Buy',
  location: {
    city: 'Gurugram',
    neighborhood: 'DLF Phase 5',
    address: 'Golf Course Road, DLF Phase 5, Gurugram',
  },
  features: {
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: 2,
    furnishing: 'Semi-Furnished',
  },
  images: [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687931-cecebd80d600?auto=format&fit=crop&w=800&q=80'
  ],
  isVerified: true,
  agent: {
    id: 'a1',
    name: 'Rahul Sharma',
    company: 'Premium Realty Hub',
    phone: '+91 9876543210',
  },
  description: 'A beautiful 3 BHK apartment with premium fittings, overlooking the golf course. Features modular kitchen, wooden flooring in bedrooms, and ample natural light. The society offers world-class amenities including a clubhouse, swimming pool, and 24x7 security. Close proximity to top schools, hospitals, and shopping malls makes it an ideal home for families.',
  amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Power Backup', '24x7 Security', 'Park', 'Reserved Parking', 'Visitor Parking'],
  createdAt: new Date().toISOString(),
};

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const [property] = useState<Property>(mockProperty);

  const formatPrice = (price: number, currency: string) => {
    if (price >= 10000000) return `${currency} ${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `${currency} ${(price / 100000).toFixed(2)} Lac`;
    return `${currency} ${price.toLocaleString()}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>

        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <Image
              src={property.images[0]}
              alt="Main property view"
              fill
              className={styles.image}
              priority
            />
          </div>
          <div className={styles.sideImages}>
            <div className={styles.sideImageWrapper}>
              <Image
                src={property.images[1] || property.images[0]}
                alt="Interior view"
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.sideImageWrapper}>
              <Image
                src={property.images[2] || property.images[0]}
                alt="Another view"
                fill
                className={styles.image}
              />
              {property.images.length > 3 && (
                <div className={styles.imageOverlay}>
                  <span className={styles.overlayText}>+{property.images.length - 3} Photos</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className={styles.contentGrid}>

          {/* Main Info Column */}
          <div className={styles.mainColumn}>

            {/* Title & Price Card */}
            <div className={styles.card}>
              <div className={styles.headerRow}>
                <div>
                  <h1 className={styles.title}>{property.title}</h1>
                  <div className={styles.location}>
                    <MapPin className={`${styles.locationIcon} w-4 h-4`} />
                    <span>{property.location.address}</span>
                  </div>
                </div>
                <div className={styles.priceContainer}>
                  <div className={styles.price}>{formatPrice(property.price, property.currency)}</div>
                  {property.pricePerSqFt && (
                    <div className={styles.pricePerSqFt}>@{property.currency}{property.pricePerSqFt.toLocaleString()} per sq.ft.</div>
                  )}
                </div>
              </div>

              {/* Key Features Bar */}
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <Maximize className={`${styles.featureIcon} w-5 h-5`} />
                  <div className={styles.featureText}>
                    <span className={styles.featureLabel}>Super Built-up Area</span>
                    <span className={styles.featureValue}>{property.area} sq.ft.</span>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <BedDouble className={`${styles.featureIcon} w-5 h-5`} />
                  <div className={styles.featureText}>
                    <span className={styles.featureLabel}>Bedrooms</span>
                    <span className={styles.featureValue}>{property.features.bedrooms}</span>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <Bath className={`${styles.featureIcon} w-5 h-5`} />
                  <div className={styles.featureText}>
                    <span className={styles.featureLabel}>Bathrooms</span>
                    <span className={styles.featureValue}>{property.features.bathrooms}</span>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <Car className={`${styles.featureIcon} w-5 h-5`} />
                  <div className={styles.featureText}>
                    <span className={styles.featureLabel}>Parking</span>
                    <span className={styles.featureValue}>{property.features.parking} Covered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Overview</h2>
              <p className={styles.descriptionText}>
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Amenities</h2>
              <div className={styles.amenitiesGrid}>
                {property.amenities.map((amenity, index) => (
                  <div key={index} className={styles.amenityItem}>
                    <Check className={`${styles.amenityIcon} w-5 h-5`} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Explore Neighborhood</h2>
              <div className={styles.mapPlaceholder}>
                <MapIcon className="w-12 h-12" />
                <p className={styles.mapText}>Interactive Map View Integration</p>
              </div>
            </div>

          </div>

          {/* Sticky Sidebar / Lead Gen */}
          <div className={styles.sidebarColumn}>
            <div className={`${styles.card} ${styles.stickyContact}`}>
              <div className={styles.contactHeader}>
                <h3 className={styles.contactTitle}>Contact Seller</h3>
                <div className={styles.agentInfo}>
                  <div className={styles.agentAvatar}>
                    {property.agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className={styles.agentName}>{property.agent.name}</p>
                    <p className={styles.agentCompany}>{property.agent.company}</p>
                  </div>
                </div>
              </div>

              <form className={styles.contactForm}>
                <input type="text" placeholder="Your Name" className={styles.input} />
                <input type="email" placeholder="Your Email" className={styles.input} />
                <input type="tel" placeholder="Your Phone Number" className={styles.input} />
                <textarea placeholder="I am interested in this property..." rows={4} className={styles.textarea}></textarea>
                <button type="button" className={styles.submitBtn}>
                  Get Contact Details
                </button>
              </form>

              <div className={styles.divider}>
                <div className={styles.dividerLine}></div>
                <span className={styles.dividerText}>or</span>
                <div className={styles.dividerLine}></div>
              </div>

              <div className={styles.actionBtns}>
                <button className={styles.actionBtn}>
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button className={styles.actionBtn}>
                  <Mail className="w-4 h-4" /> Email
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
