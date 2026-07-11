'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Mic, MicOff, Video, VideoOff, Users, MessageSquare, 
  MoreHorizontal, ChevronUp, ShieldCheck, Grid, X,
  Heart, Share, Shield, Sparkles, ArrowUpSquare
} from 'lucide-react';
import styles from './page.module.css';

export default function MeetingRoom() {
  const { id: meetingId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const initialName = searchParams.get('name') || 'You';
  const [displayName, setDisplayName] = useState(initialName);
  
  // Validation state
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  
  // Sidebar state
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Advanced features state
  const [showReactions, setShowReactions] = useState(false);
  const [showHostTools, setShowHostTools] = useState(false);
  const [showZoomAI, setShowZoomAI] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiSummaryActive, setAiSummaryActive] = useState(false);
  const [viewMode, setViewMode] = useState('Speaker View');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [hostToggles, setHostToggles] = useState({
    lockMeeting: false,
    waitingRoom: true,
    shareScreen: true,
  });
  
  // More options state
  const [isRecording, setIsRecording] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [showBreakoutModal, setShowBreakoutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // AI Chat state
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  
  // Settings state
  const [settingsTab, setSettingsTab] = useState('Video');

  // Mock participants to demonstrate Host Controls
  const [participants, setParticipants] = useState([
    { id: '1', name: 'John Doe (Guest)', isMuted: false }
  ]);

  const localVideoRef = useRef();

  useEffect(() => {
    // Validate meeting existence on mount
    fetch(`/api/meetings/${meetingId}`)
      .then(res => {
        if (res.ok) setIsValid(true);
        else setIsValid(false);
      })
      .catch(() => setIsValid(false))
      .finally(() => setIsValidating(false));
  }, [meetingId]);

  useEffect(() => {
    if (isJoined && isValid) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Failed to get local stream", err);
          alert("Could not access camera/microphone");
        });
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isJoined, isValid]);

  const copyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Invite link copied to clipboard!");
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    router.push('/');
  };

  const removeParticipant = (id) => {
    if(confirm("Are you sure you want to remove this participant?")) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const toggleParticipantMute = (id) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, isMuted: !p.isMuted } : p
    ));
  };

  const muteAll = () => {
    setParticipants(participants.map(p => ({ ...p, isMuted: true })));
    if (!isMuted) toggleMute();
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { id: Date.now(), text: chatInput, sender: displayName || 'You', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setChatInput('');
  };

  const sendEmoji = (emoji) => {
    const id = Date.now();
    setFloatingEmojis(prev => [...prev, { id, emoji }]);
    setShowReactions(false);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };

  const sendAiMessage = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    const userText = aiInput;
    setAiMessages([...aiMessages, { id: Date.now(), text: userText, isUser: true }]);
    setAiInput('');
    
    setTimeout(() => {
      let aiResponse = "";
      const lower = userText.toLowerCase();
      
      if (lower.includes('summary') || lower.includes('summarize')) {
        aiResponse = "Here is a quick summary so far: You started the meeting, enabled video, and opened the AI Companion. No major decisions have been made yet.";
      } else if (lower.includes('who') || lower.includes('participants')) {
        aiResponse = `There are currently ${participants.length + 1} people in this meeting: You and ${participants.map(p => p.name).join(', ')}.`;
      } else if (lower.includes('action item') || lower.includes('task')) {
        aiResponse = "There are no clear action items recorded in the transcript yet. Would you like me to note one down?";
      } else if (lower === 'hello' || lower === 'hi' || lower === 'hey') {
        aiResponse = "Hello! I am your Zoom AI Companion. Ask me to summarize the meeting or pull out action items!";
      } else if (lower.includes('thank')) {
        aiResponse = "You're very welcome! I'll be here if you need anything else during the meeting.";
      } else if (lower === 'ok' || lower === 'okay' || lower === 'alright' || lower === 'cool' || lower === 'got it') {
        aiResponse = "Sounds good! Just let me know if you need me to summarize anything.";
      } else if (lower.includes('how are you')) {
        aiResponse = "I'm functioning perfectly, thank you! Ready to help you manage this meeting.";
      } else if (lower.includes('joke')) {
        aiResponse = "Why did the video conference cross the road? To get to the other slide!";
      } else {
        const fallbacks = [
          "I'm still learning! Right now I'm best at summarizing the meeting and listing action items. Is there something specific you'd like me to find in the transcript?",
          "That's an interesting point! Since the meeting just started, I don't have much context on that yet. Want me to summarize what we have so far?",
          "Hmm, I'm not quite sure how to help with that yet. Try asking me for a meeting summary or who is currently on the call!"
        ];
        aiResponse = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
      
      setAiMessages(prev => [...prev, { id: Date.now(), text: aiResponse, isUser: false }]);
    }, 1000);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) screenStream.getTracks().forEach(track => track.stop());
      setIsScreenSharing(false);
      setScreenStream(null);
      if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        setIsScreenSharing(true);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
          if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
        };
      } catch (err) {
        console.error("Screen share failed", err);
      }
    }
  };

  if (isValidating) {
    return <div className={styles.joinContainer}><h2 style={{color:'black'}}>Validating meeting...</h2></div>;
  }

  if (!isValid) {
    return (
      <div className={styles.joinContainer}>
        <div className={styles.joinCard}>
          <h2>Meeting Not Found</h2>
          <p style={{color:'#555', marginBottom: '20px'}}>The meeting ID you entered is invalid or has expired.</p>
          <button className="btn-primary" onClick={() => router.push('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className={styles.joinContainer}>
        <div className={styles.joinCard}>
          <h2>Join Meeting: {meetingId}</h2>
          <input
            type="text"
            placeholder="Enter your Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={styles.input}
            autoFocus
          />
          <button 
            className="btn-primary" 
            onClick={() => setIsJoined(true)}
            disabled={!displayName.trim()}
          >
            Join
          </button>
          <button onClick={copyInviteLink} className={styles.shareBtn}>Copy Invite Link</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.meetingRoom}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.zoomText}>zoom</span>
          <span className={styles.workplaceText}>Workplace</span>
        </div>
        <div className={styles.headerRight}>
          <ShieldCheck size={20} color="#23d959" />
          <div style={{position: 'relative'}}>
            {showViewMenu && (
              <div className={styles.hostToolsMenu} style={{top: '100%', right: '0', bottom: 'auto', left: 'auto', marginTop: '10px', width: '160px'}}>
                <div style={{padding: '0 16px 8px', fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid #444', marginBottom: '4px'}}>View Options</div>
                {['Speaker View', 'Gallery View', 'Immersive View'].map(mode => (
                  <div key={mode} className={styles.hostToolItem} onClick={() => {setViewMode(mode); setShowViewMenu(false);}}>
                    <span>{mode}</span>
                    {viewMode === mode && <span style={{color: '#0b5cff'}}>✓</span>}
                  </div>
                ))}
              </div>
            )}
            <div className={styles.viewBtn} onClick={() => setShowViewMenu(!showViewMenu)}>
              <Grid size={16} /> View
            </div>
          </div>
          <div className={styles.zmLogo}>zm</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainArea}>
        
        {/* Video Grid */}
        <div 
          className={styles.videoGrid} 
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            background: viewMode === 'Immersive View' ? 'linear-gradient(to bottom, #1e3c72, #2a5298)' : '#111',
          }}
        >
          {/* Floating Emojis Overlay */}
          {floatingEmojis.map((e) => (
            <div key={e.id} className={styles.floatingEmoji}>{e.emoji}</div>
          ))}

          <div 
            className={styles.videoWrapper} 
            style={{
              ...(isScreenSharing ? {aspectRatio: 'auto', height: '100%'} : {}),
              ...(viewMode === 'Gallery View' ? {width: '45%', maxWidth: '600px', height: 'auto'} : {}),
              ...(viewMode === 'Immersive View' ? {width: '400px', height: '400px', aspectRatio: '1', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.2)', objectFit: 'cover'} : {})
            }}
          >
            {isRecording && (
              <div style={{position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10}}>
                <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ff4d4f', animation: 'pulse 1.5s infinite'}}></div>
                <span style={{fontSize: '14px', fontWeight: 'bold'}}>Recording...</span>
              </div>
            )}

            {aiSummaryActive && (
              <div style={{position: 'absolute', top: '16px', left: isRecording ? '140px' : '16px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10}}>
                <Sparkles size={14} color="#0b5cff" />
                <span style={{fontSize: '14px', fontWeight: 'bold'}}>AI Summary Active</span>
              </div>
            )}
            
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={styles.video}
              style={viewMode === 'Immersive View' ? {objectFit: 'cover', height: '100%'} : {}}
            />
            
            {showCaptions && (
              <div style={{position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', padding: '12px 24px', borderRadius: '8px', zIndex: 10, textAlign: 'center', minWidth: '300px'}}>
                <span style={{fontSize: '12px', color: '#aaa'}}>{displayName || 'You'}</span>
                <p style={{margin: '4px 0 0', fontSize: '16px', fontWeight: '500'}}>Welcome to the meeting, everyone.</p>
              </div>
            )}

            <div className={styles.nameTag}>
              {isMuted && !isScreenSharing && <MicOff size={14} color="#ff4d4f" className={styles.tagIcon} />}
              {isScreenSharing ? `${displayName || 'You'} (Screen)` : (displayName || 'You')}
            </div>
          </div>

          {/* Remote Participants */}
          {(viewMode === 'Gallery View' || viewMode === 'Immersive View') && !isScreenSharing && participants.map((p, i) => (
             <div 
               key={p.id} 
               className={styles.videoWrapper}
               style={{
                 background: '#222',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 ...(viewMode === 'Gallery View' ? {width: '45%', maxWidth: '600px', height: 'auto'} : {width: '400px', height: '400px', aspectRatio: '1', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.2)'})
               }}
             >
                <div style={{width: '100px', height: '100px', borderRadius: '50%', background: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'white'}}>
                  {p.name[0]?.toUpperCase()}
                </div>
                <div className={styles.nameTag}>
                  {p.isMuted && <MicOff size={14} color="#ff4d4f" className={styles.tagIcon} />}
                  {p.name}
                </div>
             </div>
          ))}

        </div>

        {/* Participants Sidebar (Host Controls) */}
        {showParticipants && (
          <div className={styles.participantsSidebar}>
            <div className={styles.sidebarHeader}>
              <h3>Participants (1)</h3>
              <button onClick={() => setShowParticipants(false)} className={styles.closeSidebar}><X size={16} /></button>
            </div>
            <div className={styles.participantsList}>
              <div className={styles.participantItem}>
                <div className={styles.pInfo}>
                  <div className={styles.pAvatar}>{displayName[0]?.toUpperCase() || 'Y'}</div>
                  <span className={styles.pName}>{displayName || 'You'} (Host, me)</span>
                </div>
                <div className={styles.pControls}>
                  {isMuted ? <MicOff size={16} color="red" /> : <Mic size={16} color="#aaa" />}
                </div>
              </div>
              
              {participants.map(p => (
                <div key={p.id} className={styles.participantItem}>
                  <div className={styles.pInfo}>
                    <div className={styles.pAvatar} style={{backgroundColor: '#888'}}>{p.name[0]?.toUpperCase()}</div>
                    <span className={styles.pName}>{p.name}</span>
                  </div>
                  <div className={styles.pControls}>
                    <button style={{background:'transparent', border:'none', color:'#ff4d4f', fontSize:'12px', cursor:'pointer'}} onClick={() => removeParticipant(p.id)}>Remove</button>
                    <button style={{background:'transparent', border:'none', cursor:'pointer'}} onClick={() => toggleParticipantMute(p.id)}>
                      {p.isMuted ? <MicOff size={16} color="red" /> : <Mic size={16} color="#aaa" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.sidebarFooter}>
              <button className={styles.muteAllBtn} onClick={muteAll}>Mute All</button>
            </div>
          </div>
        )}

        {showChat && (
          <div className={styles.participantsSidebar}>
            <div className={styles.sidebarHeader}>
              <h3>Meeting Chat</h3>
              <button onClick={() => setShowChat(false)} className={styles.closeSidebar}><X size={16} /></button>
            </div>
            <div className={styles.participantsList} style={{ flex: 1, padding: '16px', color: '#333', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.length === 0 ? (
                <div style={{fontStyle: 'italic', color: '#888', textAlign: 'center', marginTop: '20px'}}>
                  Welcome to the meeting chat. Messages will appear here.
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                      <span style={{fontWeight: 'bold', fontSize: '13px'}}>{msg.sender}</span>
                      <span style={{fontSize: '11px', color: '#888'}}>{msg.time}</span>
                    </div>
                    <div style={{background: '#f1f1f1', padding: '8px 12px', borderRadius: '8px', display: 'inline-block', alignSelf: 'flex-start'}}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage} className={styles.sidebarFooter} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Type message here..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} 
              />
              <button type="submit" style={{background: '#0b5cff', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer', fontWeight: 'bold'}}>
                Send
              </button>
            </form>
          </div>
        )}

        {showAIChat && (
          <div className={styles.participantsSidebar}>
            <div className={styles.sidebarHeader}>
              <h3 style={{display:'flex', alignItems:'center', gap:'8px'}}><Sparkles size={16} color="#0b5cff"/> AI Companion</h3>
              <button onClick={() => setShowAIChat(false)} className={styles.closeSidebar}><X size={16} /></button>
            </div>
            <div className={styles.participantsList} style={{ flex: 1, padding: '16px', color: '#333', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{background: '#f0f5ff', padding: '12px', borderRadius: '8px', border: '1px solid #d6e4ff'}}>
                 Hello! I'm your Zoom AI Companion. I can answer questions about what was discussed in this meeting, catch you up on anything you missed, or summarize the conversation.
               </div>
               {aiMessages.map(msg => (
                 <div key={msg.id} style={{alignSelf: msg.isUser ? 'flex-end' : 'flex-start', background: msg.isUser ? '#0b5cff' : '#f1f1f1', color: msg.isUser ? 'white' : 'black', padding: '8px 12px', borderRadius: '8px', maxWidth: '80%'}}>
                   {msg.text}
                 </div>
               ))}
            </div>
            <form onSubmit={sendAiMessage} className={styles.sidebarFooter} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Ask AI a question..." 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} 
              />
              <button type="submit" style={{background: '#0b5cff', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer', fontWeight: 'bold'}}>Ask</button>
            </form>
          </div>
        )}

      </div>

      {/* Bottom Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsGroup}>
          <div className={styles.controlBtnWrapper}>
            <button className={styles.controlBtn} onClick={toggleMute}>
              {isMuted ? <MicOff size={24} color="#ff4d4f" strokeWidth={1.5} /> : <Mic size={24} color="white" strokeWidth={1.5} />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button className={styles.arrowBtn}><ChevronUp size={16} /></button>
          </div>
          
          <div className={styles.controlBtnWrapper}>
            <button className={styles.controlBtn} onClick={toggleVideo}>
              {isVideoOff ? <VideoOff size={24} color="#ff4d4f" strokeWidth={1.5} /> : <Video size={24} color="white" strokeWidth={1.5} />}
              <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
            </button>
            <button className={styles.arrowBtn}><ChevronUp size={16} /></button>
          </div>
        </div>

        <div className={styles.controlsGroup}>
          <div className={styles.controlBtnWrapper}>
            <button className={`${styles.controlBtn} ${showParticipants ? styles.activeControl : ''}`} onClick={() => {setShowParticipants(!showParticipants); setShowChat(false);}}>
              <div className={styles.iconWithBadge}>
                <Users size={24} color="white" strokeWidth={1.5} />
                <span className={styles.badge}>{participants.length + 1}</span>
              </div>
              <span>Participants</span>
            </button>
            <button className={styles.arrowBtn}><ChevronUp size={16} /></button>
          </div>

          <div className={styles.controlBtnWrapper}>
            <button className={styles.controlBtn} onClick={() => {setShowChat(!showChat); setShowParticipants(false);}}>
              <MessageSquare size={24} color={showChat ? "#0b5cff" : "white"} strokeWidth={1.5} />
              <span>Chat</span>
            </button>
            <button className={styles.arrowBtn}><ChevronUp size={16} /></button>
          </div>

          <div className={styles.controlBtnWrapper} style={{position: 'relative'}}>
            {showReactions && (
              <div className={styles.popoverMenu} style={{left: '50%', transform: 'translateX(-50%)'}}>
                {['👍','❤️','😂','😮','🎉','👏'].map(emoji => (
                  <button key={emoji} className={styles.emojiBtn} onClick={() => sendEmoji(emoji)}>{emoji}</button>
                ))}
              </div>
            )}
            <button className={styles.controlBtn} onClick={() => {setShowReactions(!showReactions); setShowHostTools(false);}}>
              <Heart size={24} color="white" strokeWidth={1.5} />
              <span>React</span>
            </button>
            <button className={styles.arrowBtn}><ChevronUp size={16} /></button>
          </div>

          <div className={styles.controlBtnWrapper}>
            <button className={styles.controlBtn} onClick={toggleScreenShare}>
              <div style={{ backgroundColor: isScreenSharing ? '#ff4d4f' : '#23d959', borderRadius: '4px', padding: '2px' }}>
                <ArrowUpSquare size={20} color="black" strokeWidth={2} />
              </div>
              <span>{isScreenSharing ? 'Stop Share' : 'Share'}</span>
            </button>
            <button className={styles.arrowBtn}><ChevronUp size={16} /></button>
          </div>

          <div className={styles.controlBtnWrapper} style={{position: 'relative'}}>
            {showHostTools && (
              <div className={styles.hostToolsMenu} style={{left: '50%', transform: 'translateX(-50%)'}}>
                <div style={{padding: '0 16px 8px', fontWeight: 'bold', fontSize: '14px', borderBottom: '1px solid #444', marginBottom: '8px'}}>Security Settings</div>
                {Object.entries({lockMeeting: 'Lock Meeting', waitingRoom: 'Enable Waiting Room', shareScreen: 'Allow Participants to Share'}).map(([key, label]) => (
                  <div key={key} className={styles.hostToolItem} onClick={() => setHostToggles({...hostToggles, [key]: !hostToggles[key]})}>
                    <span>{label}</span>
                    <div className={`${styles.toggleSwitch} ${hostToggles[key] ? styles.active : ''}`}>
                      <div className={styles.toggleKnob}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className={styles.controlBtn} onClick={() => {setShowHostTools(!showHostTools); setShowReactions(false);}}>
              <Shield size={24} color="white" strokeWidth={1.5} />
              <span>Host tools</span>
            </button>
          </div>

          <div className={styles.controlBtnWrapper} style={{position: 'relative'}}>
            {showZoomAI && (
              <div className={styles.hostToolsMenu} style={{left: '50%', transform: 'translateX(-50%)', width: '200px'}}>
                <div style={{padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #444', marginBottom: '8px'}}>
                  <Sparkles size={16} color="#0b5cff" />
                  <span style={{fontWeight: 'bold'}}>Zoom AI Companion</span>
                </div>
                <div className={styles.hostToolItem} onClick={() => {setAiSummaryActive(!aiSummaryActive); setShowZoomAI(false);}}>
                  <span>{aiSummaryActive ? 'Stop Meeting Summary' : 'Start Meeting Summary'}</span>
                </div>
                <div className={styles.hostToolItem} onClick={() => {setShowAIChat(true); setShowZoomAI(false); setShowParticipants(false); setShowChat(false);}}>
                  <span>Ask AI Questions</span>
                </div>
                <div className={styles.hostToolItem} onClick={() => {setIsRecording(true); setShowZoomAI(false);}}>
                  <span>Smart Recording</span>
                </div>
              </div>
            )}
            <button className={styles.controlBtn} onClick={() => {setShowZoomAI(!showZoomAI); setShowHostTools(false); setShowReactions(false); setShowMore(false);}}>
              <Sparkles size={24} color="white" strokeWidth={1.5} />
              <span>Zoom AI</span>
            </button>
          </div>

          <div className={styles.controlBtnWrapper} style={{position: 'relative'}}>
            {showMore && (
              <div className={styles.hostToolsMenu} style={{left: '50%', transform: 'translateX(-50%)', width: '160px'}}>
                <div className={styles.hostToolItem} onClick={() => {setIsRecording(!isRecording); setShowMore(false);}}>
                  <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
                  {isRecording && <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ff4d4f'}}></div>}
                </div>
                <div className={styles.hostToolItem} onClick={() => {setShowCaptions(!showCaptions); setShowMore(false);}}>
                  <span>{showCaptions ? 'Hide Captions' : 'Show Captions'}</span>
                </div>
                <div className={styles.hostToolItem} onClick={() => {setShowBreakoutModal(true); setShowMore(false);}}>
                  <span>Breakout Rooms</span>
                </div>
                <div className={styles.hostToolItem} onClick={() => {setShowSettingsModal(true); setShowMore(false);}}>
                  <span>Settings</span>
                </div>
              </div>
            )}
            <button className={styles.controlBtn} onClick={() => {setShowMore(!showMore); setShowHostTools(false); setShowReactions(false); setShowZoomAI(false);}}>
              <MoreHorizontal size={24} color="white" strokeWidth={1.5} />
              <span>More</span>
            </button>
          </div>
        </div>

        <div className={styles.controlsGroup}>
          <button className={styles.endBtn} onClick={leaveMeeting}>
            <div className={styles.endBtnIcon}><X size={16} strokeWidth={3} /></div>
            <span>End</span>
          </button>
        </div>
      </div>

      {/* Breakout Rooms Modal */}
      {showBreakoutModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: 'white', color: 'black', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, fontSize: '18px'}}>Create Breakout Rooms</h2>
              <button onClick={() => setShowBreakoutModal(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={20}/></button>
            </div>
            <p style={{color: '#666', fontSize: '14px'}}>Assign 1 participant into:</p>
            <input type="number" defaultValue={1} min={1} style={{padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '60px'}} />
            <p style={{color: '#666', fontSize: '14px'}}>Rooms will be created automatically.</p>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px'}}>
              <button onClick={() => setShowBreakoutModal(false)} style={{padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>Cancel</button>
              <button onClick={() => {alert("Breakout rooms created!"); setShowBreakoutModal(false);}} style={{padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#0b5cff', color: 'white', cursor: 'pointer', fontWeight: 'bold'}}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: 'white', color: 'black', padding: '24px', borderRadius: '12px', width: '600px', height: '400px', display: 'flex'}}>
            <div style={{width: '200px', borderRight: '1px solid #eee', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <h2 style={{margin: '0 0 16px', fontSize: '18px'}}>Settings</h2>
              {['General', 'Video', 'Audio', 'Background & Effects', 'Recording'].map(tab => (
                <div key={tab} onClick={() => setSettingsTab(tab)} style={{padding: '8px', cursor: 'pointer', borderRadius: '6px', background: tab === settingsTab ? '#f0f5ff' : 'transparent', color: tab === settingsTab ? '#0b5cff' : '#333', fontWeight: tab === settingsTab ? 'bold' : 'normal'}}>{tab}</div>
              ))}
            </div>
            <div style={{flex: 1, paddingLeft: '24px', position: 'relative'}}>
              <button onClick={() => setShowSettingsModal(false)} style={{position: 'absolute', top: 0, right: 0, background:'none',border:'none',cursor:'pointer'}}><X size={20}/></button>
              <h3 style={{margin: '0 0 16px', fontSize: '16px'}}>{settingsTab} Settings</h3>
              
              {settingsTab === 'Video' && (
                <>
                  <div style={{background: '#000', height: '160px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '16px'}}>Camera Preview</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <input type="checkbox" id="hd" defaultChecked /> <label htmlFor="hd">Enable HD</label>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <input type="checkbox" id="mirror" defaultChecked /> <label htmlFor="mirror">Mirror my video</label>
                  </div>
                </>
              )}
              
              {settingsTab === 'General' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <input type="checkbox" id="dual" /> <label htmlFor="dual">Use dual monitors</label>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <input type="checkbox" id="fullscreen" defaultChecked /> <label htmlFor="fullscreen">Enter full screen automatically when starting or joining a meeting</label>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <input type="checkbox" id="copy" defaultChecked /> <label htmlFor="copy">Automatically copy invite link once the meeting starts</label>
                  </div>
                </div>
              )}
              
              {settingsTab === 'Audio' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', fontWeight: 'bold', marginBottom: '8px'}}>Speaker</label>
                    <select style={{padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc'}}>
                      <option>Same as System</option>
                      <option>Built-in Output</option>
                    </select>
                  </div>
                  <div>
                    <label style={{display: 'block', fontWeight: 'bold', marginBottom: '8px'}}>Microphone</label>
                    <select style={{padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc'}}>
                      <option>Same as System</option>
                      <option>Built-in Microphone</option>
                    </select>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <input type="checkbox" id="joinMute" defaultChecked /> <label htmlFor="joinMute">Mute my microphone when joining a meeting</label>
                  </div>
                </div>
              )}

              {settingsTab === 'Background & Effects' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <p style={{color: '#666'}}>Select a virtual background.</p>
                  <div style={{display: 'flex', gap: '12px'}}>
                    <div style={{width: '100px', height: '60px', background: '#ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #0b5cff'}}>None</div>
                    <div style={{width: '100px', height: '60px', background: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200) center/cover', borderRadius: '4px', cursor: 'pointer'}}></div>
                    <div style={{width: '100px', height: '60px', background: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200) center/cover', borderRadius: '4px', cursor: 'pointer'}}></div>
                  </div>
                </div>
              )}

              {settingsTab === 'Recording' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <input type="checkbox" id="recTimestamp" defaultChecked /> <label htmlFor="recTimestamp">Add a timestamp to the recording</label>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <input type="checkbox" id="recAudio" /> <label htmlFor="recAudio">Record a separate audio file for each participant</label>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
