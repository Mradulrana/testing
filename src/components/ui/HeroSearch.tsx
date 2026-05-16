'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Home, Building2, Store, Mic } from 'lucide-react';
import styles from './HeroSearch.module.css';

interface HeroSearchProps {
  onTabChange?: (tab: 'Buy' | 'Rent' | 'Commercial') => void;
  onSearch?: (searchParams: { query: string; budget: string; tab: 'Buy' | 'Rent' | 'Commercial' }) => void;
  availableCities?: string[];
}

const BUDGET_OPTIONS = [
  { label: 'Budget', value: '' },
  { label: '1 Lakh - 5 Lakhs', value: '1L-5L' },
  { label: '5 Lakhs - 10 Lakhs', value: '5L-10L' },
  { label: '10 Lakhs - 50 Lakhs', value: '10L-50L' },
  { label: '50 Lakhs - 1 Crore', value: '50L-1Cr' },
  { label: '1 Crore - 5 Crores', value: '1Cr-5Cr' },
  { label: '5 Crores - 10 Crores', value: '5Cr-10Cr' },
  { label: '10 Crores+', value: '10Cr+' },
];

export default function HeroSearch({ onTabChange, onSearch, availableCities = [] }: HeroSearchProps) {
  const [activeTab, setActiveTab] = useState<'Buy' | 'Rent' | 'Commercial'>('Buy');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: 'Buy' | 'Rent' | 'Commercial') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch({
        query: searchQuery,
        budget: selectedBudget.value,
        tab: activeTab
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.heroSection}>
      <div className={styles.bgDecoration}></div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          Find your perfect home
        </h1>
        <p className={styles.subtitle}>
          Search from over 10 lakh+ active property listings across India
        </p>

        <div className={styles.searchBox}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              onClick={() => handleTabChange('Buy')}
              className={`${styles.tab} ${activeTab === 'Buy' ? styles.activeTab : ''}`}
            >
              <Home className="w-4 h-4" /> Buy
            </button>
            <button
              onClick={() => handleTabChange('Rent')}
              className={`${styles.tab} ${activeTab === 'Rent' ? styles.activeTab : ''}`}
            >
              <Building2 className="w-4 h-4" /> Rent
            </button>
            <button
              onClick={() => handleTabChange('Commercial')}
              className={`${styles.tab} ${activeTab === 'Commercial' ? styles.activeTab : ''}`}
            >
              <Store className="w-4 h-4" /> Commercial
            </button>
          </div>

          {/* Search Inputs */}
          <div className={styles.inputsContainer}>
            <div className={styles.inputWrapper}>
              <MapPin className={`${styles.icon} w-5 h-5`} />
              <input
                type="text"
                placeholder="City, Locality, or Project"
                className={styles.textInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchClick()}
                list="city-options"
              />
              <datalist id="city-options">
                {availableCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
              <button className={styles.micBtn}>
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Dropdown */}
            <div className={styles.customSelectContainer} ref={dropdownRef}>
              <button
                type="button"
                className={styles.selectTrigger}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedBudget.label}</span>
                <span className={`${styles.arrowIcon} ${isDropdownOpen ? styles.arrowIconOpen : ''}`}>▼</span>
              </button>

              {isDropdownOpen && (
                <ul className={styles.dropdownList}>
                  {BUDGET_OPTIONS.map((option, index) => (
                    <li
                      key={index}
                      className={`${styles.dropdownItem} ${selectedBudget.value === option.value ? styles.dropdownItemSelected : ''}`}
                      onClick={() => {
                        setSelectedBudget(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className={styles.searchBtn} onClick={handleSearchClick}>
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
