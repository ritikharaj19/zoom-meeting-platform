'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Settings, Headphones, Video, MessageSquare, AlertTriangle, User as UserIcon } from 'lucide-react';
import styles from './GlobalSettingsModal.module.css';

export default function GlobalSettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('General');
  
  // General State
  const [theme, setTheme] = useState('Classic');
  const [autoCall, setAutoCall] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('zoom_theme') || 'Classic';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zoom_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  // Audio State
  const [speakerVol, setSpeakerVol] = useState(60);
  const [muteMic, setMuteMic] = useState(true);
  const [spaceUnmute, setSpaceUnmute] = useState(false);
  const [syncHeadset, setSyncHeadset] = useState(false);

  // Video State
  const [turnOffVideo, setTurnOffVideo] = useState(true);
  const [hideNonVideo, setHideNonVideo] = useState(false);
  const [hideSelfView, setHideSelfView] = useState(false);
  const [seeActiveSpeaker, setSeeActiveSpeaker] = useState(false);
  const [hwReceive, setHwReceive] = useState(false);
  const [hwSend, setHwSend] = useState(false);

  // Chat State
  const [sidebarLook, setSidebarLook] = useState('light');
  const [msgGrouping, setMsgGrouping] = useState('combine');
  const [openSection, setOpenSection] = useState('multiple');
  const [transDisplay, setTransDisplay] = useState('only');
  const [sendAction, setSendAction] = useState('send');
  const [notifyNewChat, setNotifyNewChat] = useState(true);
  const [notifAction, setNotifAction] = useState('all');

  const videoRef = useRef(null);

  useEffect(() => {
    let currentStream = null;

    if (isOpen && activeTab === 'Video') {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Camera access blocked, falling back to mock video", err);
          if (videoRef.current) {
            videoRef.current.src = "https://www.w3schools.com/html/mov_bbb.mp4";
          }
        });
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'General', label: 'General', icon: Settings },
    { id: 'Audio', label: 'Audio', icon: Headphones },
    { id: 'Video', label: 'Video', icon: Video },
    { id: 'Chat', label: 'Chat', icon: MessageSquare },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div className={styles.body}>
          <div className={styles.sidebar}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <div 
                  key={tab.id} 
                  className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className={`${styles.tabIcon} ${isActive ? styles.activeIcon : ''}`}>
                    <tab.icon size={16} color={isActive ? "white" : "#888"} />
                  </div>
                  <span>{tab.label}</span>
                </div>
              )
            })}
          </div>
          <div className={styles.content}>
            {activeTab === 'General' && (
              <div>
                <section className={styles.section}>
                  <h3>Theme</h3>
                  <p className={styles.subtext}>Only applied when the system is using light mode, learn more <span className={styles.infoIcon}>?</span></p>
                  <div className={styles.themeOptions}>
                    <div className={styles.themeOption} onClick={() => handleThemeChange('Classic')}>
                      <div className={`${styles.themeCircle} ${styles.themeClassic} ${theme === 'Classic' ? styles.selectedTheme : ''}`}></div>
                      <span>Classic</span>
                    </div>
                    <div className={styles.themeOption} onClick={() => handleThemeChange('Bloom')}>
                      <div className={`${styles.themeCircle} ${styles.themeBloom} ${theme === 'Bloom' ? styles.selectedTheme : ''}`}></div>
                      <span>Bloom</span>
                    </div>
                    <div className={styles.themeOption} onClick={() => handleThemeChange('Agave')}>
                      <div className={`${styles.themeCircle} ${styles.themeAgave} ${theme === 'Agave' ? styles.selectedTheme : ''}`}></div>
                      <span>Agave</span>
                    </div>
                    <div className={styles.themeOption} onClick={() => handleThemeChange('Rose')}>
                      <div className={`${styles.themeCircle} ${styles.themeRose} ${theme === 'Rose' ? styles.selectedTheme : ''}`}></div>
                      <span>Rose</span>
                    </div>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3>Navigation</h3>
                  <div className={styles.navRow}>
                    <span>Items are added to toolbar when accessed</span>
                    <span className={styles.linkText}>Reset to default</span>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3>Auto-call</h3>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={autoCall}
                      onChange={(e) => setAutoCall(e.target.checked)}
                    />
                    Automatically receive a call when a scheduled meeting starts
                  </label>
                </section>
              </div>
            )}
            
            {activeTab === 'Audio' && (
              <div>
                <section className={styles.audioSection}>
                  <h3>Speaker</h3>
                  <div className={styles.audioControlRow}>
                    <button className={styles.testBtn}>Test Speaker</button>
                    <select className={styles.deviceSelect}>
                      <option>Default - Speakers (Senary Audio)</option>
                      <option>System Default</option>
                    </select>
                  </div>
                  
                  <div className={styles.sliderRow}>
                    <span className={styles.sliderLabel}>Volume</span>
                    <input 
                      type="range" 
                      className={styles.volumeSlider} 
                      value={speakerVol}
                      onChange={(e) => setSpeakerVol(parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className={styles.levelRow}>
                    <span className={styles.levelLabel}>Output level:</span>
                    <div className={styles.levelBar}><div className={styles.levelFill} style={{width: `${speakerVol}%`}}></div></div>
                  </div>
                </section>

                <section className={styles.audioSection}>
                  <h3>Microphone</h3>
                  <div className={styles.audioControlRow}>
                    <button className={styles.testBtn}>Test Mic</button>
                    <select className={styles.deviceSelect}>
                      <option>Default - Microphone Array (Intel® Smart Sound Technol...</option>
                      <option>System Default</option>
                    </select>
                  </div>
                  
                  <div className={styles.levelRow}>
                    <span className={styles.levelLabel}>Input level:</span>
                    <div className={styles.levelBar}><div className={styles.levelFill} style={{width: '30%'}}></div></div>
                  </div>
                  
                  <div className={styles.audioCheckboxes}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} checked={muteMic} onChange={e => setMuteMic(e.target.checked)} />
                      Mute my microphone when join a meeting
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} checked={spaceUnmute} onChange={e => setSpaceUnmute(e.target.checked)} />
                      Press and hold SPACE key to temporarily unmute yourself
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} checked={syncHeadset} onChange={e => setSyncHeadset(e.target.checked)} />
                      Sync buttons on headset
                    </label>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'Video' && (
              <div className={styles.videoTabContainer}>
                <div className={styles.videoPreviewArea}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    loop
                    className={styles.videoElement}
                  />
                  <div className={styles.videoFallback}>
                    <Video size={48} color="#666" />
                  </div>
                </div>
                
                <div className={styles.videoCheckboxes}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} checked={turnOffVideo} onChange={e => setTurnOffVideo(e.target.checked)} />
                    Turn off my video when join a meeting
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} checked={hideNonVideo} onChange={e => setHideNonVideo(e.target.checked)} />
                    Hide Non-video Participants
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} checked={hideSelfView} onChange={e => setHideSelfView(e.target.checked)} />
                    Hide Self View
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} checked={seeActiveSpeaker} onChange={e => setSeeActiveSpeaker(e.target.checked)} />
                    See myself as the active speaker while speaking
                  </label>
                </div>

                <div className={styles.hardwareSection}>
                  <p className={styles.hardwareTitle}>Use hardware acceleration for:</p>
                  <div className={styles.hardwareCheckboxes}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} checked={hwReceive} onChange={e => setHwReceive(e.target.checked)} />
                      Receiving video
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} checked={hwSend} onChange={e => setHwSend(e.target.checked)} />
                      Sending video
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Chat' && (
              <div className={styles.chatTabContainer}>
                
                {/* Left sidebar behavior */}
                <h3 className={styles.chatSectionTitle}>Left sidebar behavior</h3>
                <div className={styles.chatCard}>
                  <div className={styles.chatSubSection}>
                    <p className={styles.chatSubTitle}>Customize sidebar look</p>
                    <div className={styles.sidebarLookOptions}>
                      <div 
                        className={`${styles.lookBox} ${styles.lookLight} ${sidebarLook === 'light' ? styles.lookSelected : ''}`}
                        onClick={() => setSidebarLook('light')}
                      ></div>
                      <div 
                        className={`${styles.lookBox} ${styles.lookDark} ${sidebarLook === 'dark' ? styles.lookSelected : ''}`}
                        onClick={() => setSidebarLook('dark')}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.chatDivider}></div>

                  <div className={styles.chatSubSection}>
                    <p className={styles.chatSubTitle}>Message grouping</p>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="msgGrouping" checked={msgGrouping === 'combine'} onChange={() => setMsgGrouping('combine')} className={styles.radioInput} />
                      Combine all chats into the Recents folder
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="msgGrouping" checked={msgGrouping === 'separate'} onChange={() => setMsgGrouping('separate')} className={styles.radioInput} />
                      Separate direct messages, channels, and meeting chats
                    </label>
                  </div>

                  <div className={styles.chatDivider}></div>

                  <div className={styles.chatSubSection}>
                    <p className={styles.chatSubTitle}>When opening sections or folders:</p>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="openSection" checked={openSection === 'one'} onChange={() => setOpenSection('one')} className={styles.radioInput} />
                      Open one section at a time
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="openSection" checked={openSection === 'multiple'} onChange={() => setOpenSection('multiple')} className={styles.radioInput} />
                      Open multiple sections simultaneously
                    </label>
                  </div>
                </div>

                <div className={styles.chatCard}>
                  <div className={styles.chatRowItem}>
                    <span>Manage badge settings</span>
                    <button className={styles.chatActionBtn}>Manage</button>
                  </div>
                  <div className={styles.chatDivider}></div>
                  <div className={styles.chatRowItem}>
                    <div>
                      <p style={{margin: 0, fontWeight: 500}}>Reset left sidebar to default</p>
                      <p style={{margin: 0, fontSize: '13px', color: '#666', marginTop: '2px'}}>You can drag and drop sidebar items to reorder them. Items accessed from More are added to the toolbar automatically.</p>
                    </div>
                    <button className={styles.chatActionBtn}>Reset</button>
                  </div>
                </div>

                {/* Translation section */}
                <h3 className={styles.chatSectionTitle}>Translation</h3>
                <div className={styles.translationSettings}>
                  <span style={{fontSize: '14px'}}>When translating messages, my preferred language is:</span>
                  <select className={styles.chatSelect}><option>English</option></select>
                </div>
                <p style={{fontSize: '14px', marginBottom: '8px'}}>Translation display:</p>
                
                <div className={styles.translationCards}>
                  {/* Card 1 */}
                  <div className={styles.transCard}>
                    <div className={styles.transCardBody}>
                      <div className={styles.transAvatar}><UserIcon size={16} color="white" /></div>
                      <div className={styles.transBubble}>Hello, my friend</div>
                    </div>
                    <div className={styles.transCardFooter}>
                      <label className={styles.radioLabel} style={{margin: 0}}>
                        <input type="radio" name="transDisplay" checked={transDisplay === 'only'} onChange={() => setTransDisplay('only')} className={styles.radioInput} />
                        Show translation only
                      </label>
                    </div>
                  </div>
                  
                  {/* Card 2 */}
                  <div className={styles.transCard}>
                    <div className={styles.transCardBody}>
                      <div className={styles.transAvatar}><UserIcon size={16} color="white" /></div>
                      <div>
                        <div className={styles.transBubble}>Hello, my friend</div>
                        <div className={styles.transBubble} style={{marginTop: '4px'}}>Hello, my friend</div>
                      </div>
                    </div>
                    <div className={styles.transCardFooter}>
                      <label className={styles.radioLabel} style={{margin: 0}}>
                        <input type="radio" name="transDisplay" checked={transDisplay === 'both'} onChange={() => setTransDisplay('both')} className={styles.radioInput} />
                        Show original and translation
                      </label>
                    </div>
                  </div>
                </div>

                {/* Send action */}
                <h3 className={styles.chatSectionTitle}>Send action</h3>
                <div className={styles.chatCard}>
                  <p style={{fontSize: '14px', marginBottom: '12px'}}>When writing a message, press Enter ↵ to:</p>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="sendAction" checked={sendAction === 'send'} onChange={() => setSendAction('send')} className={styles.radioInput} />
                    Send the message
                  </label>
                  <label className={styles.radioLabel} style={{marginTop: '8px'}}>
                    <input type="radio" name="sendAction" checked={sendAction === 'newline'} onChange={() => setSendAction('newline')} className={styles.radioInput} />
                    Add a new line (Use: ⌘↵ (Mac)/ ^↵ (Win) to send)
                  </label>
                </div>

                {/* Desktop notifications */}
                <h3 className={styles.chatSectionTitle}>Desktop notifications</h3>
                <div className={styles.alertBanner}>
                  <AlertTriangle size={18} color="#e5a000" />
                  <span>You've disallowed notifications in your browser. You'll need to open your browser preferences to change that.</span>
                </div>

                <div className={styles.chatCard}>
                  <p className={styles.chatSubTitle}>Send desktop notifications for:</p>
                  <div className={styles.chatRowItem} style={{marginBottom: '12px'}}>
                    <span>New chat messages</span>
                    <div 
                      className={`${styles.toggleSwitch} ${notifyNewChat ? styles.toggleOn : styles.toggleOff}`}
                      onClick={() => setNotifyNewChat(!notifyNewChat)}
                    >
                      <div className={`${styles.toggleKnob} ${notifyNewChat ? styles.knobOn : styles.knobOff}`}></div>
                    </div>
                  </div>
                  
                  <label className={styles.radioLabel}>
                    <input type="radio" name="notifAction" checked={notifAction === 'all'} onChange={() => setNotifAction('all')} className={styles.radioInput} />
                    All messages
                  </label>
                  <p className={styles.radioSubText}>Get notified for all message activity</p>
                </div>
              </div>
            )}

            {activeTab !== 'General' && activeTab !== 'Audio' && activeTab !== 'Video' && activeTab !== 'Chat' && (
              <div className={styles.placeholderContent}>
                <h3>{activeTab} Settings</h3>
                <p>This section is under construction.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
