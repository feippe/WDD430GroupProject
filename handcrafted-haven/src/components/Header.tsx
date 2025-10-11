// src/components/Header.tsx

import Link from 'next/link';
import { getSession } from '@/lib/session';
import styles from './Header.module.css';
import { LogIn, LogOut, UserCircle } from 'lucide-react';

// The component is now async to allow calling getSession()
export default async function Header() {
  const session = await getSession();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Left side remains the same */}
        <Link href="/" className={styles.logo}>
          Handcrafted Haven
        </Link>
        
        {/* Middle navigation remains the same */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/catalog" className={styles.link}>
            Catalog
          </Link>
        </nav>

        {/* --- Right Side: Dynamic Authentication Status --- */}
        <div className={styles.authSection}>
          {session.isLoggedIn ? (
            // --- User is Logged In ---
            <>
              <Link href="/profile" className={styles.userInfo}>
                <UserCircle size={20} />
                <span>{session.email}</span>
              </Link>
              <Link href="/api/logout" className={`${styles.link} ${styles.logoutButton}`}>
                <LogOut size={16} />
                <span>Logout</span>
              </Link>
            </>
          ) : (
            // --- User is Logged Out ---
            <Link href="/login" className={`${styles.link} ${styles.loginButton}`}>
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}