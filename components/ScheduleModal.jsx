import { useState } from 'react';
import styles from './ScheduleModal.module.css';
import { X, AlertTriangle } from 'lucide-react';

export default function ScheduleModal({ onClose, onSuccess }) {
  const [topic, setTopic] = useState('My Meeting');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [time, setTime] = useState('1:30');
  const [ampm, setAmpm] = useState('AM');
  const [durationHr, setDurationHr] = useState('0');
  const [durationMin, setDurationMin] = useState('40');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Parse the date and time
    const [hours, minutes] = time.split(':');
    let startHours = parseInt(hours, 10);
    if (ampm === 'PM' && startHours !== 12) startHours += 12;
    if (ampm === 'AM' && startHours === 12) startHours = 0;
    
    const start_time = new Date(`${date}T${startHours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`).toISOString();
    const duration_minutes = parseInt(durationHr) * 60 + parseInt(durationMin);

    try {
      const res = await fetch('/api/meetings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic,
          start_time,
          duration_minutes
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data.meeting_id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to schedule meeting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Schedule Meeting</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}><span className={styles.required}>*</span> Topic</label>
            <div className={styles.inputContainer}>
              <input 
                type="text" 
                value={topic} 
                onChange={e => setTopic(e.target.value)}
                className={styles.inputBox}
                required
              />
              <button type="button" className={styles.addDescBtn}>+ Add Description</button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>When</label>
            <div className={styles.whenRow}>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className={styles.selectBox} 
                required
              />
              <select value={time} onChange={e => setTime(e.target.value)} className={styles.selectBox}>
                <option value="1:00">1:00</option>
                <option value="1:30">1:30</option>
                <option value="2:00">2:00</option>
                <option value="2:30">2:30</option>
              </select>
              <select value={ampm} onChange={e => setAmpm(e.target.value)} className={styles.selectBox}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Duration</label>
            <div className={styles.durationRow}>
              <select value={durationHr} onChange={e => setDurationHr(e.target.value)} className={styles.selectBox}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
              <span className={styles.unitText}>hr</span>
              <select value={durationMin} onChange={e => setDurationMin(e.target.value)} className={styles.selectBox}>
                <option value="0">0</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="45">45</option>
              </select>
              <span className={styles.unitText}>min</span>
            </div>
          </div>

          <div className={styles.alertBox}>
            <AlertTriangle size={20} className={styles.alertIcon} />
            <p>You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time? <a href="#" className={styles.link}>Upgrade to Zoom Workplace Pro</a></p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Time Zone</label>
            <select className={styles.selectBoxFull}>
              <option>(GMT+5:30) Mumbai, Kolkata, New Delhi</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}></label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Recurring meeting
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Invitees</label>
            <input 
              type="text" 
              placeholder="Enter user names or email addresses"
              className={styles.inputBoxFull}
            />
          </div>

          <div className={styles.alertBox}>
            <AlertTriangle size={20} className={styles.alertIcon} />
            <p>Participants won't receive this meeting invite until your calendar is connected. <a href="#" className={styles.link}>Connect calendar</a></p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Meeting ID</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" name="meetingId" defaultChecked /> Generate Automatically
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="meetingId" /> Personal Meeting ID 921 405 7966
              </label>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
