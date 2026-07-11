'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('zoom_user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.zoomText}>zoom</span>
          <span className={styles.workplaceText}>Workplace</span>
        </div>
        <h1 className={styles.title}>Sign In</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <button 
            type="button" 
            className={styles.skipBtn} 
            onClick={() => {
              localStorage.setItem('zoom_user', JSON.stringify({ id: 'guest', name: 'Guest User', email: 'guest@example.com' }));
              window.location.href = '/';
            }}
          >
            Skip Login (Guest)
          </button>
        </form>
        
        <div className={styles.footer}>
          <span>New to Zoom?</span>
          <Link href="/signup" className={styles.link}>Sign Up Free</Link>
        </div>
      </div>
    </div>
  );
}
