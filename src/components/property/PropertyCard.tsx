import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, BadgeCheck, Camera, Maximize } from 'lucide-react';
import { Property } from '@/types';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    if (price >= 10000000) {
      return `${currency} ${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `${currency} ${(price / 100000).toFixed(2)} Lac`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  return (
    <div className={styles.card}>
      {/* Image Section */}
      <div className={styles.imageSection}>
        <Image
          src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          fill
          className={styles.image}
        />

        {/* Badges */}
        <div className={styles.badgesTop}>
          {property.isVerified && (
            <span className={styles.verifiedBadge}>
              <BadgeCheck className="w-3.5 h-3.5" /> Verified
            </span>
          )}
          <span className={styles.statusBadge}>
            {property.status}
          </span>
        </div>

        <button className={styles.heartBtn}>
          <Heart className="w-5 h-5" />
        </button>

        <div className={styles.badgesBottom}>
          <span className={styles.photoCount}>
            <Camera className="w-3.5 h-3.5" /> {property.images.length}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.header}>
          <div>
            <div className={styles.priceRow}>
              <h3 className={styles.price}>{formatPrice(property.price, property.currency)}</h3>
              {property.pricePerSqFt && (
                <span className={styles.pricePerSqFt}>
                  @{property.currency}{property.pricePerSqFt.toLocaleString()}/sq.ft.
                </span>
              )}
            </div>
            <Link href={`/property/${property.id}`} className={styles.titleLink}>
              <h2 className={styles.title}>
                {property.title}
              </h2>
            </Link>
            <div className={styles.location}>
              <MapPin className={`${styles.locationIcon} w-3.5 h-3.5`} />
              <span className={styles.locationText}>{property.location.neighborhood}, {property.location.city}</span>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className={styles.features}>
          <div className={styles.featureCol}>
            <span className={styles.featureLabel}>Area</span>
            <span className={styles.featureValue}>
              <Maximize className={`${styles.featureIcon} w-3.5 h-3.5`} />
              {property.area} sq.ft.
            </span>
          </div>
          {property.features.bedrooms && (
            <div className={styles.featureCol}>
              <span className={styles.featureLabel}>Config</span>
              <span className={styles.featureValue}>{property.features.bedrooms} BHK</span>
            </div>
          )}
          <div className={styles.featureCol}>
            <span className={styles.featureLabel}>Furnishing</span>
            <span className={styles.featureValue}>{property.features.furnishing || 'Unfurnished'}</span>
          </div>
        </div>

        <p className={styles.description}>
          {property.description}
        </p>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.agentInfo}>
            <div className={styles.agentAvatar}>
              {property.agent.name.charAt(0)}
            </div>
            <div className={styles.agentDetails}>
              <p className={styles.agentName}>{property.agent.name}</p>
              <p className={styles.agentCompany}>{property.agent.company}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
