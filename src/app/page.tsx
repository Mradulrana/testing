'use client';

import { useState } from 'react';
import HeroSearch from '@/components/ui/HeroSearch';
import PropertyCard from '@/components/property/PropertyCard';
import { useProperties } from '@/context/PropertyContext';
import styles from './Home.module.css';

export default function Home() {
  const [filterStatus, setFilterStatus] = useState<'Buy' | 'Rent' | 'Commercial'>('Buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const { properties } = useProperties();

  // Extract unique cities from properties
  const availableCities = Array.from(new Set(properties.map(p => p.location.city).filter(Boolean)));

  const handleSearch = (params: { query: string; budget: string; tab: 'Buy' | 'Rent' | 'Commercial' }) => {
    setSearchQuery(params.query);
    setBudgetRange(params.budget);
    setFilterStatus(params.tab);
  };

  const filteredProperties = properties.filter((property) => {
    // 1. Status Filter
    const matchStatus = property.status === filterStatus || (filterStatus === 'Commercial' && property.type === 'Commercial');

    // 2. Query Filter (City or Neighborhood)
    const matchQuery = !searchQuery ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Budget Filter
    let matchBudget = true;
    if (budgetRange) {
      const price = property.price;
      switch (budgetRange) {
        case '1L-5L': matchBudget = price >= 100000 && price <= 500000; break;
        case '5L-10L': matchBudget = price > 500000 && price <= 1000000; break;
        case '10L-50L': matchBudget = price > 1000000 && price <= 5000000; break;
        case '50L-1Cr': matchBudget = price > 5000000 && price <= 10000000; break;
        case '1Cr-5Cr': matchBudget = price > 10000000 && price <= 50000000; break;
        case '5Cr-10Cr': matchBudget = price > 50000000 && price <= 100000000; break;
        case '10Cr+': matchBudget = price > 100000000; break;
        default: matchBudget = true;
      }
    }

    return matchStatus && matchQuery && matchBudget;
  });

  return (
    <div className={styles.container}>
      <HeroSearch
        onTabChange={setFilterStatus}
        onSearch={handleSearch}
        availableCities={availableCities}
      />

      <div className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Featured Properties</h2>
            <p className={styles.sectionSubtitle}>Handpicked properties just for you</p>
          </div>
          <a href="#" className={styles.viewAllLink}>View all &rarr;</a>
        </div>

        {filteredProperties.length > 0 ? (
          <div className={styles.grid}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No featured properties found for {filterStatus}. Try searching for something else.</p>
          </div>
        )}

        <div className={styles.mobileViewAll}>
          <a href="#" className={styles.viewAllLink} style={{ display: 'block' }}>View all properties &rarr;</a>
        </div>
      </div>
    </div>
  );
}
