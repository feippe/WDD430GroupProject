import { notFound } from 'next/navigation';
import ReviewSection from '@/components/ReviewSection';
import { getSession } from '@/lib/session';
import styles from './product.module.css';

type ProductData = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string; 
    imageUrl: string; 
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

// La función getProduct se mantiene exactamente igual
async function getProduct(productId: string): Promise<ProductData | null> {
    const vercelUrl = process.env.VERCEL_URL;
    const localUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const baseUrl = vercelUrl 
        ? `https://${vercelUrl}` 
        : (localUrl || 'http://localhost:3000');
    try {
        const productResponse = await fetch(`${baseUrl}/api/products/${productId}`, {
            cache: 'no-store'
        });
        if (!productResponse.ok) {
            console.error(`API response failed with status: ${productResponse.status}`);
            return null;
        }
        return productResponse.json();
    } catch (error) {
        console.error("Failed to fetch product data:", error);
        return null;
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;
  const product = await getProduct(productId);
  const session = await getSession();

  if (!product) {
    notFound();
  }

  return (
    <main className={styles.mainContainer}> 
      
      <div className={styles.productGrid}>
        {/* --- Product Image --- */}
        <div className={styles.imageContainer}>
          <img 
            src={product.imageUrl} 
            alt={product.name}  
            className={styles.image}
          />
        </div>

        {/* --- Product Info --- */}
        <div className={styles.infoContainer}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productPrice}>${product.price}</p>
          <p className={styles.productDescription}>{product.description}</p>
          
          <div className={styles.ctaContainer}>
            <input type="number" defaultValue="1" min="1" className={styles.quantitySelector} />
            <button className={styles.addToCartButton}>Add to Cart</button>
          </div>
        </div>
      </div>
      
      {/* --- Reviews Section --- */}
      <div className={styles.reviewsContainer}>
        <ReviewSection productId={productId} isLoggedIn={session.isLoggedIn ?? false} />
      </div>

    </main>
  );
}