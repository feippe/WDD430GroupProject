import { PrismaClient, Product } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import styles from './Catalog.module.css';

const prisma = new PrismaClient();

export default async function CatalogPage() {
  
  const products = await prisma.product.findMany();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Catalog</h1>
      <div className={styles.grid}>
        {/*  */}
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}