'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Copy, ChevronRight, Video, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react';
import styles from './page.module.css';

export default function ManageMeeting() {
  const { id: meetingId } = useParams();
  const router = useRouter();
  
  const [meeting, setMeeting] = useState(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    fetch(`/api/meetings/${meetingId}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Not found");
      })
      .then(data => setMeeting(data))
      .catch(() => setMeeting(null))
      .finally(() => setIsValidating(false));
  }, [meetingId]);

  if (isValidating) {
    return <div className={styles.container}><h2 style={{color: 'black', padding: '40px'}}>Loading meeting details...</h2></div>;
  }

  if (!meeting) {
    return (
      <div className={styles.container} style={{padding: '40px'}}>
        <h2 style={{color: 'black'}}>Meeting Not Found</h2>
        <button className="btn-primary" onClick={() => window.location.href = '/'} style={{marginTop: '20px'}}>Return to Home</button>
      </div>
    );
  }

  const date = new Date(meeting.start_time);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' });
  
  const inviteLink = `http://localhost:3001/meeting/${meeting.meeting_id}`;

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

  const copyInvitationText = () => {
    const text = `You have been invited to a Zoom meeting.\n\nTopic: ${meeting.title}\nTime: ${dateString} ${timeString}\n\nJoin Zoom Meeting\n${inviteLink}\n\nMeeting ID: ${meeting.meeting_id}`;
    navigator.clipboard.writeText(text);
    alert("Full invitation copied!");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      await fetch(`/api/meetings/${meetingId}`, { method: 'DELETE' });
      window.location.href = '/';
    }
  };

  const handleEdit = async () => {
    const newTopic = prompt("Enter new meeting topic:", meeting.title);
    if (newTopic && newTopic.trim() !== '') {
      const res = await fetch(`/api/meetings/${meetingId}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTopic })
      });
      if (res.ok) {
        setMeeting({ ...meeting, title: newTopic });
      }
    }
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        
        {/* Breadcrumb Header */}
        <div className={styles.breadcrumb}>
          <span className={styles.linkText} onClick={() => window.location.href = '/'}>My Meetings</span>
          <ChevronRight size={14} color="#666" />
          <span className={styles.currentText}>Manage "{meeting.title}"</span>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={`${styles.tab} ${styles.activeTab}`}>Details</div>
          <div className={styles.tab}>Live Streaming</div>
        </div>

        {/* Details Table */}
        <div className={styles.detailsSection}>
          <div className={styles.row}>
            <div className={styles.label}>Topic</div>
            <div className={styles.value} style={{fontWeight: '500'}}>{meeting.title}</div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.label}>Time</div>
            <div className={styles.value}>{dateString} {timeString} Mumbai, Kolkata, New Delhi</div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.label}>Meeting ID</div>
            <div className={styles.value} style={{fontSize: '16px'}}>{meeting.meeting_id.replace('-', ' ')}</div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.label}>Security</div>
            <div className={styles.value}>
              <span className={styles.checkMark}>✓</span> Passcode <span style={{letterSpacing: '2px', color: '#666', margin: '0 8px'}}>********</span> 
              <span className={styles.linkText} style={{marginLeft: '4px'}}>Show</span>
            </div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.label}>Invite Link</div>
            <div className={styles.value}>
              <a href={inviteLink} className={styles.linkText} style={{marginRight: '12px'}}>{inviteLink}?pwd=bl3qG3vTm...</a>
              <button onClick={copyInvite} className={styles.iconBtn} title="Copy Link"><Copy size={18} color="#666" /></button>
            </div>
          </div>
          
          <div className={styles.row} style={{borderBottom: 'none'}}>
            <div className={styles.label}>Add to</div>
            <div className={styles.value} style={{display: 'flex', gap: '20px'}}>
              <span className={styles.calendarLink}><CalendarIcon size={16} color="#0b5cff" /> Google Calendar</span>
              <span className={styles.calendarLink}><CalendarIcon size={16} color="#0b5cff" /> Outlook Calendar (.ics)</span>
              <span className={styles.calendarLink}><CalendarIcon size={16} color="#0b5cff" /> Yahoo Calendar</span>
            </div>
          </div>
        </div>
        
        <hr className={styles.divider} />
        
        <div className={styles.detailsSection}>
          <div className={styles.row}>
            <div className={styles.label}>Encryption</div>
            <div className={styles.value}>
              <span style={{color: '#23d959', marginRight: '8px'}}>✓</span> Enhanced encryption
            </div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.label}>My notes</div>
            <div className={styles.value}>Allow everyone to use meeting transcript with My notes</div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.label}>Meeting chat</div>
            <div className={styles.value}>Allow users to access meeting chats before and after the meeting</div>
          </div>
          
          <div className={styles.row} style={{borderBottom: 'none', alignItems: 'flex-start'}}>
            <div className={styles.label}>Video</div>
            <div className={styles.value}>
              <div style={{display: 'flex', marginBottom: '8px'}}>
                <span style={{width: '100px'}}>Host</span>
                <span>off</span>
              </div>
              <div style={{display: 'flex'}}>
                <span style={{width: '100px'}}>Participant</span>
                <span>off</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <button className={styles.startBtn} onClick={() => router.push(`/meeting/${meeting.meeting_id}`)}>Start</button>
          <button className={styles.secondaryBtn} onClick={copyInvitationText}><Copy size={16} /> Copy Invitation</button>
          <button className={styles.secondaryBtn} onClick={handleEdit}>Edit</button>
          <button className={styles.secondaryBtn} onClick={handleDelete}>Delete</button>
        </div>

      </div>
    </div>
  );
}
