'use client';
import { X } from 'lucide-react';
import styles from './AccountModal.module.css';

export default function AccountModal({ isOpen, onClose, initialTab, user }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Settings</div>
          <div className={`${styles.tab} ${initialTab === 'Profile' ? styles.activeTab : ''}`}>Profile</div>
          <div className={`${styles.tab} ${initialTab === 'Billing' ? styles.activeTab : ''}`}>Plans and Billing</div>
          <div className={`${styles.tab} ${initialTab === 'Help' ? styles.activeTab : ''}`}>Help Center</div>
        </div>
        
        <div className={styles.content}>
          <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
          
          {initialTab === 'Profile' && (
            <div>
              <h2 className={styles.contentTitle}>My Profile</h2>
              <div className={styles.profileAvatar}>{user?.initials || 'U'}</div>
              <div className={styles.profileField}>
                <div className={styles.fieldLabel}>FULL NAME</div>
                <div className={styles.fieldValue}>{user?.name || 'Guest User'}</div>
              </div>
              <div className={styles.profileField}>
                <div className={styles.fieldLabel}>SIGN-IN EMAIL</div>
                <div className={styles.fieldValue}>{user?.email || 'guest@example.com'}</div>
              </div>
              <div className={styles.profileField}>
                <div className={styles.fieldLabel}>PERSONAL MEETING ID</div>
                <div className={styles.fieldValue}>*** *** 8115</div>
              </div>
            </div>
          )}

          {initialTab === 'Billing' && (
            <div>
              <h2 className={styles.contentTitle}>Plans and Billing</h2>
              <div className={styles.planCard}>
                <div className={styles.planTitle}>Zoom Workplace Basic (Current)</div>
                <p style={{color: '#555', fontSize: '14px', marginBottom: '16px'}}>You are currently on a free plan. Meetings with 3 or more participants are limited to 40 minutes.</p>
                <div style={{fontWeight: '700', fontSize: '20px'}}>$0 / month</div>
                <button className={styles.planBtn}>Upgrade to Pro</button>
              </div>
            </div>
          )}

          {initialTab === 'Help' && (
            <div>
              <h2 className={styles.contentTitle}>Help Center</h2>
              <div className={styles.helpGrid}>
                <div className={styles.helpCard}>
                  <h3 style={{fontWeight: 600, marginBottom: '8px'}}>Knowledge Base</h3>
                  <p style={{fontSize: '14px', color: '#555'}}>Search for articles and tutorials to learn how to use Zoom Workplace.</p>
                </div>
                <div className={styles.helpCard}>
                  <h3 style={{fontWeight: 600, marginBottom: '8px'}}>Community</h3>
                  <p style={{fontSize: '14px', color: '#555'}}>Ask questions and connect with other users in the Zoom Community.</p>
                </div>
                <div className={styles.helpCard}>
                  <h3 style={{fontWeight: 600, marginBottom: '8px'}}>Video Tutorials</h3>
                  <p style={{fontSize: '14px', color: '#555'}}>Watch step-by-step videos to get the most out of your meetings.</p>
                </div>
              </div>
              <button className={styles.planBtn} style={{marginTop: '24px'}}>Contact Support</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
