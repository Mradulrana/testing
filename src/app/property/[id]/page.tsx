'use client';

import { useState, useEffect } from 'react';
import { useProperties } from '@/context/PropertyContext';
import Image from 'next/image';
import { MapPin, Maximize, BedDouble, Bath, Car, Check, Phone, Mail, Share2, Heart, Map as MapIcon } from 'lucide-react';
import { Property } from '@/types';
import styles from './PropertyDetail.module.css';

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const { properties, loading } = useProperties();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!loading && properties.length > 0) {
      const foundProperty = properties.find(p => p.id === params.id);
      setProperty(foundProperty || null);
    }
  }, [loading, properties, params.id]);

  if (loading) {
    return <div className={styles.container}><div className={styles.mainContent}>Loading...</div></div>;
  }

  if (!property) {
    return <div className={styles.container}><div className={styles.mainContent}>Property not found</div></div>;
  }

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
