'use client';
import { useEffect, useState } from 'react';
import ActionButtons from '@/components/ActionButtons';
import MeetingCard from '@/components/MeetingCard';
import styles from './page.module.css';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [recentMeetings, setRecentMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/meetings', { cache: 'no-store' });
        const data = await res.json();
        setUpcomingMeetings(data.filter(m => new Date(m.start_time) > new Date()));
        setRecentMeetings(data.filter(m => new Date(m.start_time) <= new Date()));
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
      }
    };
    fetchMeetings();
  }, []);
  const timeString = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateString = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className={styles.homeContainer}>
      <div className={styles.centeredArea}>
        
        {/* Clock Section */}
        <div className={styles.clockSection}>
          <h1 className={styles.timeText}>{timeString}</h1>
          <p className={styles.dateText}>{dateString}</p>
        </div>

        {/* Action Buttons Section */}
        <div className={styles.actionsContainer}>
           <ActionButtons />
        </div>

      </div>

      {/* Right Sidebar for Upcoming Meetings */}
      <div className={styles.rightSidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Upcoming Meetings</h3>
          <ChevronRight size={20} color="#666" />
        </div>
        
        <div className={styles.meetingsList}>
          {upcomingMeetings.length === 0 ? (
            <div className={styles.emptyMeetings}>
              <p>No upcoming meetings today</p>
            </div>
          ) : (
            upcomingMeetings.slice(0, 4).map(m => (
              <MeetingCard key={m.id} meeting={m} type="upcoming" />
            ))
          )}
        </div>

        <div className={styles.sidebarHeader} style={{marginTop: '32px'}}>
          <h3>Recent Meetings</h3>
          <ChevronRight size={20} color="#666" />
        </div>
        
        <div className={styles.meetingsList}>
          {recentMeetings.length === 0 ? (
            <div className={styles.emptyMeetings}>
              <p>No recent meetings</p>
            </div>
          ) : (
            recentMeetings.slice(0, 4).map(m => (
              <MeetingCard key={m.id} meeting={m} type="recent" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
