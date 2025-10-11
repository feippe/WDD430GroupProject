// src/app/profile/page.tsx

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { User, ShoppingBag, Star, Package, Settings } from 'lucide-react';
import styles from './profile.module.css'; // <-- 1. Import the CSS module

// --- Small example components for the tab content ---
const MyOrders = () => <div className={styles.panelContent}>The list of your past orders will be displayed here.</div>;
const MyReviews = () => <div className={styles.panelContent}>The reviews you have written will be displayed here.</div>;
const MyProducts = () => <div className={styles.panelContent}>Here you can manage the products you have for sale.</div>;
const MySettings = () => <div className={styles.panelContent}>Your account settings can be edited here.</div>;


export default async function ProfilePage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/login');
  }

  const isSeller = session.role === 'seller';

  return (
    // 2. Apply the styles using the 'styles' object
    <main className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        {/* --- 1. Welcome Card --- */}
        <section className={styles.welcomeCard}>
          <div className={styles.avatarContainer}>
            <User className={styles.avatarIcon} />
          </div>
          <div className={styles.userInfo}>
            <h1>{session.email}</h1>
            <p>Welcome back</p>
            {isSeller && (
              <span className={styles.sellerBadge}>
                Seller
              </span>
            )}
          </div>
        </section>

        {/* --- 2. Control Panel --- */}
        <section className={styles.controlPanel}>
          
          <div className={styles.panelSection}>
            <h2 className={styles.panelHeader}>
              <ShoppingBag />
              My Orders
            </h2>
            <MyOrders />
          </div>

          <div className={styles.panelSection}>
            <h2 className={styles.panelHeader}>
              <Star />
              My Reviews
            </h2>
            <MyReviews />
          </div>
          
          {isSeller && (
            <div className={`${styles.panelSection} ${styles.sellerSection}`}>
              <h2 className={styles.panelHeader}>
                <Package />
                My Products
              </h2>
              <MyProducts />
            </div>
          )}

          <div className={styles.panelSection}>
            <h2 className={styles.panelHeader}>
              <Settings />
              Settings
            </h2>
            <MySettings />
          </div>
        </section>

      </div>
    </main>
  );
}