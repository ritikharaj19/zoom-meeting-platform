'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const EditableField = ({ label, initialValue, type = 'text', options = [], subText = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(initialValue);

  const handleSave = () => {
    setValue(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className={styles.fieldRow}>
      <div className={styles.fieldLabel}>{label}</div>
      <div className={styles.fieldValue}>
        {isEditing ? (
          <div className={styles.editForm}>
            {type === 'select' ? (
              <select 
                value={tempValue} 
                onChange={e => setTempValue(e.target.value)}
                className={styles.editInput}
              >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            ) : (
              <input 
                type="text" 
                value={tempValue} 
                onChange={e => setTempValue(e.target.value)} 
                className={styles.editInput} 
              />
            )}
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleSave}>Save</button>
              <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            {value}
            {subText && <span className={styles.fieldSub}>{subText}</span>}
          </div>
        )}
      </div>
      {!isEditing && (
        <div className={styles.fieldAction} onClick={() => setIsEditing(true)}>
          {value === 'Not set' ? 'Add' : 'Edit'}
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const [user, setUser] = useState({ name: 'Guest', email: 'guest@example.com', initials: 'G' });
  const [isEditingPmi, setIsEditingPmi] = useState(false);
  const [pmiValue, setPmiValue] = useState('*** *** *966');
  const [tempPmi, setTempPmi] = useState('*** *** *966');

  useEffect(() => {
    const storedUser = localStorage.getItem('zoom_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name,
        email: parsed.email,
        initials: parsed.name.charAt(0).toUpperCase()
      });
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* Zoom Global Header (Mock) */}
      <header className={styles.globalHeader}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.logo}>zoom</Link>
          <nav className={styles.navLinks}>
            <span>Solutions</span>
            <span>Resources</span>
            <span>Plans & Pricing</span>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <nav className={styles.navLinks}>
            <span>Schedule</span>
            <span>Join</span>
            <span>Host</span>
            <span>Web App</span>
          </nav>
          <Link href="/" style={{textDecoration: 'none'}}>
            <div className={styles.avatarMini}>{user.initials}</div>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Profile Banner */}
        <div className={styles.profileBanner}>
          <div className={styles.avatarLarge}>{user.initials}</div>
          <div className={styles.profileBannerInfo}>
            <h1 className={styles.profileName}>{user.name}</h1>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>
        </div>

        {/* Section: Personal Information */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>Personal information</div>
          <EditableField label="Phone" initialValue="Not set" />
          <EditableField 
            label="Language" 
            initialValue="English" 
            type="select" 
            options={[
              {label: 'English', value: 'English'},
              {label: 'Spanish', value: 'Spanish'},
              {label: 'French', value: 'French'}
            ]} 
          />
          <EditableField 
            label="Time Zone" 
            initialValue="(GMT+5:30) Mumbai, Kolkata, New Delhi" 
            type="select" 
            options={[
              {label: '(GMT+5:30) Mumbai, Kolkata, New Delhi', value: '(GMT+5:30) Mumbai, Kolkata, New Delhi'},
              {label: '(GMT-8:00) Pacific Time (US & Canada)', value: '(GMT-8:00) Pacific Time (US & Canada)'},
              {label: '(GMT+0:00) Greenwich Mean Time', value: '(GMT+0:00) Greenwich Mean Time'}
            ]} 
          />
          <EditableField 
            label="Date Format" 
            initialValue="mm/dd/yyyy" 
            subText="Example: 07/11/2026"
            type="select" 
            options={[
              {label: 'mm/dd/yyyy', value: 'mm/dd/yyyy'},
              {label: 'dd/mm/yyyy', value: 'dd/mm/yyyy'}
            ]} 
          />
          <EditableField 
            label="Time Format" 
            initialValue="Use 12-hour time" 
            subText="(Example: 02:00 PM)"
            type="select" 
            options={[
              {label: 'Use 12-hour time', value: 'Use 12-hour time'},
              {label: 'Use 24-hour time', value: 'Use 24-hour time'}
            ]} 
          />
        </section>

        {/* Section: Meeting */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>Meeting</div>
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>Personal Meeting ID</div>
            <div className={styles.fieldValue}>
              {isEditingPmi ? (
                <div className={styles.editForm}>
                  <input type="text" value={tempPmi} onChange={e => setTempPmi(e.target.value)} className={styles.editInput} />
                  <div className={styles.editActions}>
                    <button className={styles.saveBtn} onClick={() => {setPmiValue(tempPmi); setIsEditingPmi(false);}}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => {setTempPmi(pmiValue); setIsEditingPmi(false);}}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>{pmiValue}</div>
                  <div className={styles.urlLink}>https://us05web.zoom.us/j/{pmiValue.replace(/[^0-9]/g, '') || '966'}?pwd=UWJRaIMxYk9lU3ltay8yZWRjNHg0QT09</div>
                  <div className={styles.checkboxWrapper}>
                    <input type="checkbox" id="pmi-check" defaultChecked />
                    <label htmlFor="pmi-check">Use this ID for instant meetings</label>
                  </div>
                </>
              )}
            </div>
            {!isEditingPmi && <div className={styles.fieldAction} onClick={() => setIsEditingPmi(true)}>Edit</div>}
          </div>
        </section>

        {/* Section: Account */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>Account</div>
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>License</div>
            <div className={styles.fieldValue}>
              <div className={styles.upgradeLink}>Upgrade to get more features</div>
              
              <div className={styles.licenseGrid}>
                <div className={styles.licenseLabel}>Zoom Chat</div>
                <div className={styles.licenseVal}>Enabled</div>
                
                <div className={styles.licenseLabel}>Zoom Meetings</div>
                <div className={styles.licenseVal}>
                  <strong>Basic</strong><br/>
                  You can host up to 40 minutes per meeting.<br/>
                  <span className={styles.upgradeLink}>Increase Meeting Capacity</span>
                </div>
                
                <div className={styles.licenseLabel}>Zoom Whiteboard</div>
                <div className={styles.licenseVal}>3 editable boards with standard features</div>
                
                <div className={styles.licenseLabel}>Zoom Scheduler</div>
                <div className={styles.licenseVal}>Enabled</div>
                
                <div className={styles.licenseLabel}>Zoom Clips Basic</div>
                <div className={styles.licenseVal}>Enabled</div>
                
                <div className={styles.licenseLabel}>Zoom Canvas</div>
                <div className={styles.licenseVal}>Enabled</div>
              </div>
            </div>
            <div className={styles.fieldAction}></div>
          </div>
        </section>

        {/* Section: Sign In */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>Sign In</div>
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>Sign-In Email</div>
            <div className={styles.fieldValue}>{user.email}</div>
            <div className={styles.fieldAction}>Edit</div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>Linked Accounts</div>
            <div className={styles.fieldValue}>Google</div>
            <div className={styles.fieldAction}>Edit</div>
          </div>
        </section>

        {/* Section: Where you're logged in */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>Where you're logged in</div>
          <table className={styles.deviceTable}>
            <thead>
              <tr>
                <th>Device Name</th>
                <th>OS</th>
                <th>Last Login Location</th>
                <th>Last Login Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Chrome</strong><br/><span style={{fontSize: '12px', color: '#666'}}>Browser (v132)</span></td>
                <td>Windows</td>
                <td>Bengaluru, Karnataka, India</td>
                <td>07/11/2026 01:13 AM</td>
                <td>Current</td>
              </tr>
              <tr>
                <td>iPhone (V12)</td>
                <td>iOS</td>
                <td>Bengaluru, Karnataka, India</td>
                <td>07/10/2026 09:00 AM</td>
                <td><span className={styles.upgradeLink}>Sign out</span></td>
              </tr>
            </tbody>
          </table>
          <div style={{textAlign: 'right', marginTop: '12px'}}>
            <span className={styles.upgradeLink}>Sign me out from all devices</span>
          </div>
        </section>

        {/* Section: Calendar */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>Calendar and Contacts Integration</div>
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}></div>
            <div className={styles.fieldValue}>
              <p style={{marginBottom: '12px', color: '#555', fontSize: '13px', lineHeight: '1.4'}}>
                We support the following services: Google Calendar, Microsoft Exchange, and Microsoft Office 365.<br/>
                If you want to add your contacts by importing a CSV file, go to <span className={styles.upgradeLink}>Personal Contacts</span>.
              </p>
              <button className={styles.configureBtn}>Configure Calendar and Contacts Service</button>
            </div>
            <div className={styles.fieldAction}></div>
          </div>
        </section>
      </main>

      {/* Global Dark Footer */}
      <footer className={styles.globalFooter}>
        <div className={styles.footerInner}>
          <div className={styles.footerCol}>
            <h4>About</h4>
            <ul>
              <li>Zoom Blog</li>
              <li>Customers</li>
              <li>Our Team</li>
              <li>Careers</li>
              <li>Integrations</li>
              <li>Partners</li>
              <li>Investors</li>
              <li>Press</li>
              <li>ESG</li>
              <li>Media Kit</li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Download</h4>
            <ul>
              <li>Zoom Workplace App</li>
              <li>Zoom Rooms Client</li>
              <li>Browser Extension</li>
              <li>Outlook Plug-in</li>
              <li>Zoom Plugin for HCL Notes</li>
              <li>Zoom Virtual Backgrounds</li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Sales</h4>
            <ul>
              <li>1.888.799.9666</li>
              <li>Contact Sales</li>
              <li>Plans & Pricing</li>
              <li>Request a Demo</li>
              <li>Webinars and Events</li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Support</h4>
            <ul>
              <li>Test Zoom</li>
              <li>Account</li>
              <li>Support Center</li>
              <li>Learning Center</li>
              <li>Zoom Community</li>
              <li>Feedback</li>
              <li>Contact Us</li>
              <li>Accessibility</li>
              <li>Privacy, Security, Legal</li>
            </ul>
          </div>
          
          <div className={styles.footerMeta}>
            <div className={styles.metaGroup}>
              <label>Language</label>
              <select className={styles.footerSelect}><option>English</option></select>
            </div>
            <div className={styles.metaGroup}>
              <label>Currency</label>
              <select className={styles.footerSelect}><option>Indian Rupee ₹</option></select>
            </div>
            <div className={styles.socialIcons}>
              {/* Mock Social Icons */}
              <div className={styles.socialIcon}>in</div>
              <div className={styles.socialIcon}>X</div>
              <div className={styles.socialIcon}>f</div>
              <div className={styles.socialIcon}>y</div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Floating Action Button (like in the screenshot bottom right) */}
      <div className={styles.fab}>
        <div className={styles.fabIcon}></div>
      </div>
    </div>
  );
}
