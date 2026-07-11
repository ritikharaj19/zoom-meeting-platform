import styles from './MeetingCard.module.css';
import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MeetingCard({ meeting, type }) {
  const router = useRouter();
  const date = new Date(meeting.start_time);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className={styles.card}>
      <div className={styles.timeInfo}>
        <Clock size={16} className={styles.icon} />
        <span>{type === 'recent' ? 'Ended' : timeString}</span>
      </div>
      <div className={styles.details}>
        <h3 className={styles.title}>{meeting.title}</h3>
        <p className={styles.id}>Meeting ID: {meeting.meeting_id}</p>
        <p className={styles.date}>{dateString}</p>
      </div>
      <div className={styles.actions}>
        <button 
          className="btn-outline"
          onClick={() => type === 'recent' ? router.push(`/manage/${meeting.meeting_id}`) : router.push(`/meeting/${meeting.meeting_id}`)}
        >
          {type === 'recent' ? 'View Details' : 'Start'}
        </button>
      </div>
    </div>
  );
}
