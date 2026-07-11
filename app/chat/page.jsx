'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, Filter, Plus, 
  MessageCircle, AtSign, Hash, Calendar as CalendarIcon, 
  MoreHorizontal, Star, ChevronRight, Video, Phone,
  Search, Smile, Paperclip, Camera, Mic, Send
} from 'lucide-react';
import styles from './page.module.css';

// Mock Data
const INITIAL_CONTACTS = [
  { id: '1', name: 'Design Team', isChannel: true, unread: 3, status: 'online', avatar: 'DT' },
  { id: '2', name: 'Ritikha Raj', isChannel: false, unread: 0, status: 'online', avatar: 'RR' },
  { id: '3', name: 'Engineering Sync', isChannel: true, unread: 0, status: 'offline', avatar: 'ES' },
  { id: '4', name: 'Alex Jenkins', isChannel: false, unread: 1, status: 'away', avatar: 'AJ' },
];

const INITIAL_MESSAGES = {
  '1': [
    { id: 'm1', senderId: 'me', text: 'Did anyone review the new mockups?', timestamp: '10:00 AM' },
    { id: 'm2', senderId: 'them', senderName: 'Sarah', text: 'Yes, looking great! I left a few comments.', timestamp: '10:05 AM' }
  ],
  '2': [
    { id: 'm1', senderId: 'them', senderName: 'Ritikha Raj', text: 'Are we still on for the 3:30 meeting?', timestamp: '2:15 PM' }
  ],
  '3': [],
  '4': [
    { id: 'm1', senderId: 'them', senderName: 'Alex Jenkins', text: 'Hey, can you send over the latest API docs?', timestamp: 'Yesterday' },
    { id: 'm2', senderId: 'me', text: 'Sure thing, give me a minute to find the link.', timestamp: 'Yesterday' }
  ]
};

export default function ChatDashboard() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeChatId, setActiveChatId] = useState('1');
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [messagesData, setMessagesData] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData, activeChatId]);

  const activeContact = contacts.find(c => c.id === activeChatId);
  const activeMessages = messagesData[activeChatId] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesData(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
    
    setInputValue('');
  };

  const selectContact = (id) => {
    setActiveChatId(id);
    // Mark as read
    setContacts(contacts.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const filteredContacts = contacts.filter(contact => {
    switch (activeFilter) {
      case 'all': return true;
      case 'at': return contact.unread > 0; // Mentions/Unread
      case 'msg': return !contact.isChannel; // DMs
      case 'hash': return contact.isChannel; // Channels
      default: return false;
    }
  });

  return (
    <div className={styles.workspaceContainer}>
      
      {/* Left Sidebar (Contacts List) */}
      <div className={styles.secondarySidebar}>
        <div className={styles.secHeader}>
          <h2>Team Chat <ChevronDown size={16} /></h2>
          <div className={styles.secHeaderActions}>
            <Filter size={18} color="#666" className={styles.iconBtn} />
            <div className={styles.plusBtn}><Plus size={16} color="white" /></div>
          </div>
        </div>

        <div className={styles.filterRow}>
          <div className={`${styles.filterItem} ${activeFilter === 'all' ? styles.activeFilter : ''}`} onClick={() => setActiveFilter('all')}>All</div>
          <div className={`${styles.filterItem} ${activeFilter === 'at' ? styles.activeFilter : ''}`} onClick={() => setActiveFilter('at')}><AtSign size={16} /></div>
          <div className={`${styles.filterItem} ${activeFilter === 'msg' ? styles.activeFilter : ''}`} onClick={() => setActiveFilter('msg')}><MessageCircle size={16} /></div>
          <div className={`${styles.filterItem} ${activeFilter === 'hash' ? styles.activeFilter : ''}`} onClick={() => setActiveFilter('hash')}><Hash size={16} /></div>
          <div className={`${styles.filterItem} ${activeFilter === 'cal' ? styles.activeFilter : ''}`} onClick={() => setActiveFilter('cal')}><CalendarIcon size={16} /></div>
          <div className={`${styles.filterItem} ${activeFilter === 'more' ? styles.activeFilter : ''}`} onClick={() => setActiveFilter('more')}><MoreHorizontal size={16} /></div>
        </div>

        <div className={styles.searchContainer}>
          <Search size={14} color="#888" className={styles.searchIcon} />
          <input type="text" placeholder="Jump to..." className={styles.searchInput} />
        </div>

        <div className={styles.contactsList}>
          <div className={styles.navSectionHeader}>
            <ChevronDown size={14} color="#666" /> Starred
          </div>
          
          <div className={styles.navSectionHeader}>
            <ChevronDown size={14} color="#666" /> Recent
          </div>
          
          <div className={styles.channelsList}>
            {filteredContacts.length === 0 ? (
              <div style={{padding: '16px', textAlign: 'center', color: '#888', fontSize: '13px'}}>
                No conversations found.
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div 
                  key={contact.id} 
                  className={`${styles.contactItem} ${activeChatId === contact.id ? styles.activeContact : ''}`}
                  onClick={() => selectContact(contact.id)}
                >
                  <div className={styles.avatarWrapper}>
                    {contact.isChannel ? (
                      <div className={styles.channelAvatar}><Hash size={14} /></div>
                    ) : (
                      <div className={styles.userAvatar}>{contact.avatar}</div>
                    )}
                    {!contact.isChannel && <div className={`${styles.statusDot} ${styles[contact.status]}`}></div>}
                  </div>
                  <span className={styles.contactName}>{contact.name}</span>
                  {contact.unread > 0 && <span className={styles.unreadBadge}>{contact.unread}</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.mainWorkArea}>
        {activeContact ? (
          <div className={styles.chatPane}>
            
            {/* Chat Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatHeaderTitle}>
                  {activeContact.isChannel && <Hash size={18} color="#666" />}
                  <h3>{activeContact.name}</h3>
                  <ChevronDown size={16} color="#666" />
                </div>
                {!activeContact.isChannel && (
                  <span className={styles.chatHeaderStatus}>
                    <div className={`${styles.statusDotHeader} ${styles[activeContact.status]}`}></div>
                    {activeContact.status}
                  </span>
                )}
              </div>
              <div className={styles.chatHeaderActions}>
                <div className={styles.headerBtn}><Video size={18} /></div>
                <div className={styles.headerBtn}><Phone size={18} /></div>
                <div className={styles.headerBtn}><MoreHorizontal size={18} /></div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className={styles.messagesFeed}>
              {activeMessages.length === 0 ? (
                <div className={styles.emptyFeed}>
                  <p>This is the start of your chat history.</p>
                </div>
              ) : (
                activeMessages.map(msg => (
                  <div key={msg.id} className={`${styles.messageWrapper} ${msg.senderId === 'me' ? styles.myMessage : styles.theirMessage}`}>
                    {msg.senderId === 'them' && (
                      <div className={styles.msgAvatar}>{msg.senderName.charAt(0)}</div>
                    )}
                    <div className={styles.messageContent}>
                      {msg.senderId === 'them' && (
                        <div className={styles.msgHeader}>
                          <span className={styles.msgSenderName}>{msg.senderName}</span>
                          <span className={styles.msgTime}>{msg.timestamp}</span>
                        </div>
                      )}
                      <div className={styles.bubble}>
                        {msg.text}
                      </div>
                      {msg.senderId === 'me' && (
                        <span className={styles.myMsgTime}>{msg.timestamp}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <form className={styles.inputForm} onSubmit={handleSendMessage}>
                <div className={styles.inputBoxContainer}>
                  <textarea 
                    className={styles.messageInput} 
                    placeholder={`Message ${activeContact.name}...`}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    rows={1}
                  />
                  <div className={styles.inputToolbar}>
                    <div className={styles.toolbarLeft}>
                      <button type="button" className={styles.toolbarBtn}><Paperclip size={18} /></button>
                      <button type="button" className={styles.toolbarBtn}><Camera size={18} /></button>
                      <button type="button" className={styles.toolbarBtn}><Smile size={18} /></button>
                      <button type="button" className={styles.toolbarBtn}><Mic size={18} /></button>
                    </div>
                    <button type="submit" className={styles.sendBtn} disabled={!inputValue.trim()}>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MessageCircle size={64} color="#ccc" strokeWidth={1} />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>

    </div>
  );
}
