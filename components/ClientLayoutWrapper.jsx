'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

export default function ClientLayoutWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const user = localStorage.getItem('zoom_user');
    
    if (!user && !isAuthPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router, isAuthPage]);

  if (!isAuthorized && !isAuthPage) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6'}}>Loading...</div>;
  }

  const isProfilePage = pathname === '/profile';

  if (isAuthPage || isProfilePage) {
    return <main style={{background: isProfilePage ? 'white' : '#f1f3f6', minHeight: '100vh'}}>{children}</main>;
  }

  return (
    <div className="app-container">
      <TopBar />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
