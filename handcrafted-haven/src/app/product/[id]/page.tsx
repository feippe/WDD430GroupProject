import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './ProductPage.module.css';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

const prisma = new PrismaClient();
interface ProductPageProps {
  params: {
    id: string;
  };
}

// Define the shape of the data fetched from your API
type ProductData = {
    id: string;
    name: string;
    description: string;
    price: number;
    // Add other fields...
}

type ProductPageProps = {
  params: {
    id: string; // The product ID from the URL
  }
}

// Function to fetch product details (GET /api/products/[id])
async function getProduct(productId: string): Promise<ProductData | null> {
    try {
        // NOTE: Use internal Next.js fetching if possible, or ensure NEXT_PUBLIC_BASE_URL is set
        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/products/${productId}`, {
            cache: 'no-store' // Do not cache, ensuring dynamic content
        });
        
        if (!productResponse.ok) return null;

        return productResponse.json();
    } catch (error) {
        console.error("Failed to fetch product data:", error);
        return null;
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;
  const product = await getProduct(productId);

  if (!product) {
    return <main className="p-8"><h1>Product Not Found</h1><p>The requested handcrafted item does not exist.</p></main>;
  }

  // Use state or a mechanism to force refresh the ReviewList from the parent component.
  // We'll use a simple timestamp key for the client component to force re-render.
  const now = Date.now(); 

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">{product.name}</h1>
        <p className="text-2xl text-indigo-600 mb-4">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
        
        {/* Placeholder for Product Image */}
        <div className="my-6 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
            
        </div>
      </div>
      
      <hr />

      {/* Reviews Section */}
      <ReviewList productId={productId} key={productId + '-list-' + now} /> 
      
      {/* Review Form (The form handles its own refresh logic) */}
      <ReviewForm productId={productId} onReviewSubmitted={() => { 
        // Simple client-side refresh logic can be complex in pure App Router.
        // For simplicity, the ReviewList component will handle fetching upon mount.
        // In a complex app, you'd use React Context or a state management solution (Zustand/Redux) here.
        // For now, the ReviewList component is designed to fetch upon mount/update.
      }} />

    </main>
  );
}
