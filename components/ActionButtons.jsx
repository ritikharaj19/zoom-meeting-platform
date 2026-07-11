'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, PlusSquare, Calendar } from 'lucide-react';
import styles from './ActionButtons.module.css';
import ScheduleModal from './ScheduleModal';

export default function ActionButtons() {
  const router = useRouter();
  const [activeForm, setActiveForm] = useState(null); // 'join' or 'schedule'
  const [joinId, setJoinId] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleNewMeeting = async () => {
    try {
      const res = await fetch('/api/meetings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Instant Meeting'
        }),
      });
      const data = await res.json();
      router.push(`/meeting/${data.meeting_id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create meeting. Is the backend running?");
    }
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (joinId && displayName) {
      router.push(`/meeting/${joinId}?name=${encodeURIComponent(displayName)}`);
    } else if (joinId) {
      router.push(`/meeting/${joinId}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <div className={styles.actionItem} onClick={handleNewMeeting}>
          <div className={`${styles.iconContainer} ${styles.orangeBg}`}>
            <Video size={32} color="white" />
          </div>
          <span className={styles.label}>New Meeting</span>
        </div>

        <div className={styles.actionItem} onClick={() => setActiveForm(activeForm === 'join' ? null : 'join')}>
          <div className={`${styles.iconContainer} ${styles.blueBg}`}>
            <PlusSquare size={32} color="white" />
          </div>
          <span className={styles.label}>Join</span>
        </div>

        <div className={styles.actionItem} onClick={() => setActiveForm('schedule')}>
          <div className={`${styles.iconContainer} ${styles.blueBg}`}>
            <Calendar size={32} color="white" />
          </div>
          <span className={styles.label}>Schedule</span>
        </div>
      </div>

      {activeForm === 'join' && (
        <form onSubmit={handleJoinMeeting} className={styles.formContainer}>
          <input
            type="text"
            placeholder="Enter Meeting ID or Personal Link Name"
            className={styles.input}
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Your Display Name"
            className={styles.input}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            style={{marginTop: '12px'}}
          />
          <button type="submit" className="btn-primary" style={{marginTop: '16px'}}>Join Meeting</button>
        </form>
      )}

      {activeForm === 'schedule' && (
        <ScheduleModal 
          onClose={() => setActiveForm(null)} 
          onSuccess={(meetingId) => { setActiveForm(null); router.push(`/manage/${meetingId}`); }} 
        />
      )}
    </div>
  );
}
