'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw, Copy, Edit2, MessageSquare, X, CalendarPlus } from 'lucide-react';
import styles from './page.module.css';

export default function MeetingsPage() {
  const router = useRouter();
  
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  useEffect(() => {
    fetch('/api/meetings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(m => ({
          id: m.meeting_id,
          title: m.title,
          timeStr: new Date(m.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          host: 'Ritikha Raj', // Mock user for now
          meetingIdFormatted: m.meeting_id.length > 9 
            ? m.meeting_id.replace(/(.{3})(.{4})(.{4})/, '$1 $2 $3')
            : m.meeting_id
        }));
        setMeetings(formatted);
        if (formatted.length > 0 && !selectedMeetingId) {
          setSelectedMeetingId(formatted[0].id);
        }
      })
      .catch(err => console.error("Failed to fetch meetings:", err));
  }, []);

  // Update selected if deleted
  useEffect(() => {
    if (meetings.length > 0 && !meetings.find(m => m.id === selectedMeetingId)) {
      setSelectedMeetingId(meetings[0].id);
    }
  }, [meetings, selectedMeetingId]);

  const selectedMeeting = meetings.find(m => m.id === selectedMeetingId);

  const handleCopy = () => {
    if (!selectedMeeting) return;
    const inv = `${selectedMeeting.host} is inviting you to a scheduled Zoom meeting.\n\nTopic: ${selectedMeeting.title}\nTime: ${selectedMeeting.timeStr}\n\nMeeting ID: ${selectedMeeting.meetingIdFormatted}`;
    navigator.clipboard.writeText(inv);
    alert('Invitation copied to clipboard!');
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      try {
        await fetch(`/api/meetings/${selectedMeetingId}`, { method: 'DELETE' });
        setMeetings(meetings.filter(m => m.id !== selectedMeetingId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = async () => {
    const newTitle = prompt("Enter new meeting title:", selectedMeeting.title);
    if (newTitle) {
      try {
        await fetch(`/api/meetings/${selectedMeetingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle })
        });
        setMeetings(meetings.map(m => m.id === selectedMeeting.id ? { ...m, title: newTitle } : m));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.meetingsContainer}>
      {/* Left Sidebar */}
      <div className={styles.leftSidebar}>
        <div className={styles.tabsHeader}>
          <RefreshCcw size={16} color="#666" className={styles.refreshIcon} />
          <div className={styles.tabList}>
            <span className={styles.activeTab}>Upcoming</span>
          </div>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.pmiSection}>
            <div className={styles.pmiNumber}>921 405 7966</div>
            <div className={styles.pmiLabel}>My Personal Meeting ID (PMI)</div>
          </div>
          
          <div className={styles.sidebarDivider}></div>

          <h3 className={styles.dateHeader}>Today</h3>

          <div className={styles.upcomingList}>
            {meetings.length === 0 ? (
              <p style={{textAlign: 'center', padding: '20px', color: '#888', fontSize: '14px'}}>No upcoming meetings</p>
            ) : (
              meetings.map(m => {
                const isSelected = m.id === selectedMeetingId;
                return (
                  <div 
                    key={m.id} 
                    className={`${styles.miniMeetingCard} ${isSelected ? styles.selectedCard : ''}`}
                    onClick={() => setSelectedMeetingId(m.id)}
                  >
                    <div className={styles.miniTitle}>{m.title}</div>
                    <div className={styles.miniTime}>{m.timeStr}</div>
                    <div className={styles.miniHost}>Host: {m.host}</div>
                    <div className={styles.miniId}>Meeting ID: {m.meetingIdFormatted}</div>
                  </div>
                );
              })
            )}
          </div>

          <div className={styles.addCalendarContainer}>
            <button className={styles.addCalendarBtn} onClick={() => alert('Add calendar integration...')}>
              <CalendarPlus size={16} />
              <span>Add a calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className={styles.rightContent}>
        {selectedMeeting && (
          <>
            <h1 className={styles.pageTitle}>{selectedMeeting.title}</h1>
            
            <div className={styles.meetingDetails}>
              <p>{selectedMeeting.timeStr}</p>
              <p>Host: {selectedMeeting.host}</p>
              <p>Meeting ID: {selectedMeeting.meetingIdFormatted}</p>
            </div>

            <div className={styles.actionsRow}>
              <button className={styles.startBtn} onClick={() => router.push(`/meeting/${selectedMeeting.id}`)}>Start</button>
              <button className={styles.outlineBtn} onClick={() => alert('Opening chat with invitees...')}>
                <MessageSquare size={14} /> Message Invitees
              </button>
              <button className={styles.outlineBtn} onClick={handleCopy}>
                <Copy size={14} /> Copy Invitation
              </button>
              <button className={styles.outlineBtn} onClick={handleEdit}>
                <Edit2 size={14} /> Edit
              </button>
              <button className={styles.outlineBtn} onClick={handleDelete}>
                <X size={14} /> Delete
              </button>
            </div>

            <button className={styles.textBtn}>Show Meeting Invitation</button>
          </>
        )}
      </div>
    </div>
  );
}
