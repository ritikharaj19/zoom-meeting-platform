'use client';
import { useState, useEffect } from 'react';
import styles from './TopBar.module.css';
import { Search, ChevronLeft, ChevronRight, Clock, User, CreditCard, BookOpen, Download } from 'lucide-react';
import AccountModal from './AccountModal';

const StatusIcon = ({ status, size = 16 }) => {
  if (status === 'Available') return <div style={{width: size, height: size, borderRadius: '50%', backgroundColor: '#4a9c59'}} />;
  if (status === 'Busy') return <div style={{width: size, height: size, borderRadius: '50%', backgroundColor: '#e25241', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: size === 16 ? '12px' : '8px', fontWeight: 'bold', lineHeight: 1}}>×</div>;
  if (status === 'Do Not Disturb') return <div style={{width: size, height: size, borderRadius: '50%', backgroundColor: '#e25241', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{width: size/2, height: 2, backgroundColor: 'white'}}/></div>;
  if (status === 'Away') return <div style={{width: size, height: size, borderRadius: '50%', backgroundColor: '#8a8d91', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{width: 2, height: size/3, backgroundColor: 'white', position: 'relative', top: '-1px', left: '-1px'}}><div style={{width: size/4, height: 2, backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0}}/></div></div>;
  if (status === 'Out of Office') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8a8d91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <line x1="10" y1="14" x2="14" y2="18"></line>
      <line x1="14" y1="14" x2="10" y2="18"></line>
    </svg>
  );
  return null;
};

export default function TopBar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountModalTab, setAccountModalTab] = useState('Profile');
  const [user, setUser] = useState({ name: 'Guest', email: '', initials: 'G' });
  const [userStatus, setUserStatus] = useState('Available');

  useEffect(() => {
    const storedUser = localStorage.getItem('zoom_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name,
        email: parsed.email,
        initials: parsed.name.charAt(0).toUpperCase()
      });
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('zoom_user');
    window.location.href = '/login';
  };

  const openAccountModal = (tab) => {
    setAccountModalTab(tab);
    setIsAccountModalOpen(true);
    setShowProfileMenu(false);
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <span className={styles.zoomText}>zoom</span>
          <span className={styles.workplaceText}>Workplace</span>
        </div>
      </div>
      
      <div className={styles.centerSection}>
        <div className={styles.historyNav}>
          <ChevronLeft size={18} color="#b1b1b1" />
          <ChevronRight size={18} color="#b1b1b1" />
          <Clock size={16} color="#b1b1b1" />
        </div>
        <div className={styles.searchContainer}>
          <Search size={16} color="#666" />
          <input type="text" placeholder="Search" className={styles.searchInput} />
          <span className={styles.shortcut}>Ctrl+K</span>
        </div>
      </div>
      
      <div className={styles.rightSection}>
        <button className={styles.upgradeBtn}>Upgrade<br/>to Pro</button>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar} onClick={() => setShowProfileMenu(!showProfileMenu)} style={{cursor: 'pointer'}}>{user.initials}</div>
            <div className={styles.statusBadge}><StatusIcon status={userStatus} size={10} /></div>
          </div>
          
          {showProfileMenu && (
            <div className={styles.profileMenu}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarLg}>{user.initials}</div>
                <div className={styles.profileInfo}>
                  <div className={styles.profileName}>{user.name}</div>
                  <div className={styles.profileEmail}>{user.email}</div>
                </div>
              </div>
              
              <div className={styles.divider}></div>
              
              <div className={styles.menuSection}>
                {['Available', 'Busy', 'Do Not Disturb', 'Away', 'Out of Office'].map((s) => (
                  <div 
                    key={s} 
                    className={styles.menuItemText} 
                    style={{display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: userStatus === s ? '#f1f3f6' : 'transparent'}}
                    onClick={() => {setUserStatus(s); setShowProfileMenu(false);}}
                  >
                    <StatusIcon status={s} /> {s}
                  </div>
                ))}
              </div>
              
              <div className={styles.divider}></div>
              
              <div className={styles.menuSection}>
                <div className={styles.menuItem} onClick={() => window.location.href = '/profile'}><User size={16} /> My account</div>
                <div className={styles.menuItem} onClick={() => openAccountModal('Billing')}><CreditCard size={16} /> Plans and billing</div>
                <div className={styles.menuItem} style={{justifyContent: 'space-between'}} onClick={() => openAccountModal('Help')}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}><BookOpen size={16} /> Help</div>
                  <ChevronRight size={16} color="#666" />
                </div>
              </div>
              
              <div className={styles.divider}></div>
              
              <div className={styles.menuSection}>
                <div className={styles.menuItemText} onClick={() => {alert('Launching Zoom Web App...'); setShowProfileMenu(false);}}>Zoom Web App</div>
                <div className={styles.menuItemText} onClick={() => { localStorage.removeItem('zoom_user'); window.location.href = '/login'; }}>Add account</div>
                <div className={styles.menuItemText} onClick={handleSignOut}>Sign out</div>
              </div>
              
              <div className={styles.promoBox}>
                <div className={styles.promoTitle}>Get more from Zoom</div>
                <div className={styles.promoText}>Upgrade to Zoom Workplace Pro for unlimited meetings and more</div>
                <button className={styles.promoBtn} onClick={() => {alert('Redirecting to Pro Upgrade page...'); setShowProfileMenu(false);}}>Upgrade now</button>
              </div>
              
              <div className={styles.downloadLink} onClick={() => {window.open('https://zoom.us/download', '_blank'); setShowProfileMenu(false);}}>
                <Download size={16} /> Download the Zoom app
              </div>
            </div>
          )}
        </div>
      </div>
      
      <AccountModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        initialTab={accountModalTab} 
        user={user} 
      />
    </div>
  );
}
