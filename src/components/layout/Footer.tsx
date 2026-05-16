import React from 'react';
import Link from 'next/link';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
              <div style={{width: '2rem', height: '2rem', backgroundColor: 'var(--blue-600)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
                <Home className="w-5 h-5" />
              </div>
              <span style={{fontWeight: 700, fontSize: '1.5rem', color: 'white'}}>
                Zameen<span style={{color: 'var(--blue-500)'}}>Market</span>
              </span>
            </Link>
            <p style={{fontSize: '0.875rem', color: 'var(--gray-400)', lineHeight: 1.5}}>
              Your trusted partner in finding the perfect property across Madhya Pradesh. We connect buyers, sellers, and tenants with ease.
            </p>
          </div>

          <div>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li><Link href="#" className={styles.link}>About Us</Link></li>
              <li><Link href="#" className={styles.link}>Properties for Sale</Link></li>
              <li><Link href="#" className={styles.link}>Properties for Rent</Link></li>
              <li><Link href="#" className={styles.link}>Commercial Spaces</Link></li>
              <li><Link href="#" className={styles.link}>Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Contact Us</h3>
            <ul className={styles.linkList}>
              <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-400)', fontSize: '0.875rem'}}>
                <Phone className="w-4 h-4" /> +91 98765 43210
              </li>
              <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-400)', fontSize: '0.875rem'}}>
                <Mail className="w-4 h-4" /> support@zameenmarket.com
              </li>
              <li style={{display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--gray-400)', fontSize: '0.875rem'}}>
                <MapPin className="w-4 h-4" style={{marginTop: '0.25rem', flexShrink: 0}} />
                123 Business Park, Vijay Nagar, Indore, Madhya Pradesh 452010
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Follow Us</h3>
            <p style={{fontSize: '0.875rem', color: 'var(--gray-400)', marginBottom: '1rem'}}>
              Stay updated with the latest properties and market trends.
            </p>
            <div className={styles.socialRow}>
              <a href="#" className={styles.socialIcon}><FaFacebook className="w-5 h-5" /></a>
              <a href="#" className={styles.socialIcon}><FaTwitter className="w-5 h-5" /></a>
              <a href="#" className={styles.socialIcon}><FaInstagram className="w-5 h-5" /></a>
              <a href="#" className={styles.socialIcon}><FaLinkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} ZameenMarket. All rights reserved.
          </p>
          <div style={{display: 'flex', gap: '1rem'}}>
            <Link href="#" className={styles.link}>Privacy Policy</Link>
            <Link href="#" className={styles.link}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
