'use client';
import styles from './page.module.css';
import { 
  Calendar as CalendarIcon, Users, Hash, 
  MessageCircle, Video, Star, MoreHorizontal 
} from 'lucide-react';

export default function MorePage() {
  const apps = [
    { name: 'Scheduler', icon: CalendarIcon },
    { name: 'Hub', icon: Users, isNew: true },
    { name: 'Canvas', icon: Hash },
    { name: 'Whiteboards', icon: MessageCircle },
    { name: 'Clips', icon: Video },
    { name: 'Tasks', icon: Star },
    { name: 'Notes', icon: MoreHorizontal },
    { name: 'Contacts', icon: Users },
  ];

  return (
    <div className={styles.moreContainer}>
      <h1 className={styles.title}>Apps & More</h1>
      
      <div className={styles.grid}>
        {apps.map(app => (
          <div key={app.name} className={styles.appCard} onClick={() => alert('Coming soon!')}>
            {app.isNew && <div className={styles.newBadge}>NEW</div>}
            <app.icon size={48} color="#555" strokeWidth={1} />
            <span className={styles.appName}>{app.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
