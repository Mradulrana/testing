'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Search, User, Menu, PlusCircle } from 'lucide-react';
import styles from './Navbar.module.css';
import PostPropertyModal from '../property/PostPropertyModal';
import { useProperties } from '@/context/PropertyContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addProperty } = useProperties();
  const { user, role, signOut } = useAuth();
  const router = useRouter();

  const handlePostPropertyClick = () => {
    if (!user) {
      alert("Please login first to post a property.");
      router.push('/auth');
      return;
    }
    if (role !== 'seller') {
      alert("Access Denied: Only sellers can post properties.");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <div className={styles.leftSection}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <Home className="w-5 h-5" />
              </div>
              <span className={styles.logoText}>
                Zameen<span className={styles.logoHighlight}>Market</span>
              </span>
            </Link>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.actions}>
              {user ? (
                 <button onClick={signOut} className={styles.actionBtn}>
                   <User className="w-5 h-5" />
                   <span className={styles.actionText}>Sign Out</span>
                 </button>
              ) : (
                <Link href="/auth" className={styles.actionBtn}>
                  <User className="w-5 h-5" />
                  <span className={styles.actionText}>Login / Register</span>
                </Link>
              )}
            </div>

            <button onClick={handlePostPropertyClick} className={styles.postBtn}>
              <span>Post Property</span>
              <span className={styles.freeBadge}>FREE</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <PostPropertyModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={addProperty}
    />
    </>
  );
}
