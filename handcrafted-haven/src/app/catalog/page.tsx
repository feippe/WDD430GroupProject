import { PrismaClient, Product } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import styles from './Catalog.module.css';

const prisma = new PrismaClient();
const PRODUCTS_PER_PAGE = 8; // Define how many products to show per page

interface CatalogPageProps {
  searchParams: {
    page?: string; // The page number from the URL query
  }
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  // Determine the current page, default to 1 if not present
  const currentPage = Number(searchParams.page) || 1;

  // Fetch the total count of products for pagination
  const totalProducts = await prisma.product.count();
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Fetch the products for the current page
  const products = await prisma.product.findMany({
    take: PRODUCTS_PER_PAGE,
    skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
  });

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Collection</h1>
        <p className={styles.subtitle}>
          Browse through our curated selection of handcrafted goods.
        </p>
      </div>

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className={styles.noProducts}>
          No products found. Please check back later!
        </p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/catalog"
      />
    </main>
  );
}