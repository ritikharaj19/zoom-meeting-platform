'use client';
import { useState } from 'react';
import styles from './Sidebar.module.css';
import { Home, Video, MessageSquare, MoreHorizontal, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import GlobalSettingsModal from './GlobalSettingsModal';

export default function Sidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Meetings', icon: Video, path: '/meetings' },
    { name: 'Chat', icon: MessageSquare, path: '/chat' },
    { name: 'More', icon: MoreHorizontal, path: '/more' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.topNav}>
        {navItems.map(item => {
          const isActive = pathname === item.path || (pathname === '/' && item.name === 'Home'); 
          return (
            <Link href={item.path} key={item.name} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
              <div className={styles.iconWrapper}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className={styles.label}>{item.name}</span>
            </Link>
          );
        })}
      </div>
      <div className={styles.bottomNav}>
        <div className={styles.navItem} onClick={() => setIsSettingsOpen(true)} style={{cursor: 'pointer'}}>
          <div className={styles.iconWrapper}>
            <Settings size={22} strokeWidth={1.5} />
          </div>
        </div>
      </div>
      
      <GlobalSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
