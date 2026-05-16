'use client';

import { useState } from 'react';
import { Home, Users, TrendingUp, Search, Filter, MoreVertical, Plus, Bell } from 'lucide-react';
import { Lead } from '@/types';
import styles from './Dashboard.module.css';

// Mock Data
const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    propertyId: '1',
    userName: 'Vikram Singh',
    userEmail: 'vikram.s@example.com',
    userPhone: '+91 9876500001',
    message: 'I am interested in this property and would like to schedule a visit.',
    status: 'New',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 'l2',
    propertyId: '1',
    userName: 'Anita Desai',
    userEmail: 'anita.d@example.com',
    userPhone: '+91 9876500002',
    message: 'Is the price negotiable? I am a pre-approved buyer.',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: 'l3',
    propertyId: '2',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.k@example.com',
    userPhone: '+91 9876500003',
    message: 'Looking for more pictures of the private garden.',
    status: 'Closed',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  }
];

export default function Dashboard() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>

        {/* Dashboard Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Seller Dashboard</h1>
            <p className={styles.subtitle}>Manage your properties and leads efficiently</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn}>
              <Bell className="w-5 h-5" />
            </button>
            <button className={styles.primaryBtn}>
              <Plus className="w-5 h-5" /> Post New Property
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
              <Home className="w-6 h-6" />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Active Listings</p>
              <p className={styles.statValue}>12</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconWrapper} ${styles.iconGreen}`}>
              <Users className="w-6 h-6" />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Total Leads</p>
              <p className={styles.statValue}>48</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconWrapper} ${styles.iconPurple}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Conversion Rate</p>
              <p className={styles.statValue}>8.4%</p>
            </div>
          </div>
        </div>

        {/* Leads Table Section */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Recent Leads</h2>
            <div className={styles.tableActions}>
              <div className={styles.searchWrapper}>
                <Search className={`${styles.searchIcon} w-4 h-4`} />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className={styles.searchInput}
                />
              </div>
              <button className={styles.filterBtn}>
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Contact Details</th>
                  <th className={styles.th}>Property Interest</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactAvatar}>
                          {lead.userName.charAt(0)}
                        </div>
                        <div className={styles.contactDetails}>
                          <div className={styles.contactName}>{lead.userName}</div>
                          <div className={styles.contactPhone}>{lead.userPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.propertyInfo}>
                        <div className={styles.propertyId}>Property ID: {lead.propertyId}</div>
                        <div className={styles.propertyMessage}>{lead.message}</div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={
                        lead.status === 'New' ? styles.statusBadgeNew :
                        lead.status === 'Contacted' ? styles.statusBadgeContacted :
                        styles.statusBadgeClosed
                      }>
                        {lead.status}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateText}>{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className={styles.td}>
                      <button className={styles.moreBtn}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>Showing 1 to 3 of 48 results</span>
            <div className={styles.paginationControls}>
              <button className={styles.pageBtn}>Previous</button>
              <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
              <button className={styles.pageBtn}>2</button>
              <button className={styles.pageBtn}>3</button>
              <button className={styles.pageBtn}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
