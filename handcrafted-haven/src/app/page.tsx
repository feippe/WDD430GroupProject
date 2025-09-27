// src/app/page.tsx
import Link from 'next/link';
import { PrismaClient, Product } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import styles from './HomePage.module.css';

const prisma = new PrismaClient();

export default async function HomePage() {
  // Fetch a few featured products from the database
  const featuredProducts = await prisma.product.findMany({
    take: 4, // Get the first 4 products
  });

  return (
    <>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Handcrafted, From the Heart</h1>
          <p className={styles.heroSubtitle}>Discover unique pieces that tell a story.</p>
          <Link href="/catalog" className={styles.ctaButton}>
            View Collection
          </Link>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className={styles.featured}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.grid}>
          {featuredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Call to Action (CTA) Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to find your next favorite piece?</h2>
        <Link href="/catalog" className={styles.ctaButton}>
          Explore Full Catalog
        </Link>
      </section>
    </>
  );
}