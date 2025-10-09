
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import ReviewSection from '@/components/ReviewSection';


// Define the shape of the data fetched from your API
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

// Function to fetch product details (GET /api/products/[id])
async function getProduct(productId: string): Promise<ProductData | null> {
    // Determine the base URL dynamically:
    // 1. Use VERCEL_URL (available during Vercel server-side build/runtime)
    // 2. Fallback to the local environment variable
    // 3. Final fallback to http://localhost:3000 (if variable is missing)
    const vercelUrl = process.env.VERCEL_URL;
    const localUrl = process.env.NEXT_PUBLIC_BASE_URL;
    // Construct the base URL using standard Next.js environment logic
    const baseUrl = vercelUrl 
        ? `https://${vercelUrl}` 
        : (localUrl || 'http://localhost:3000');
    try {
        // Construct the full API URL
        const productResponse = await fetch(`${baseUrl}/api/products/${productId}`, {
            cache: 'no-store' // Do not cache, ensuring dynamic content
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

  if (!product) {
    return <main className="p-8"><h1>Product Not Found</h1><p>The requested handcrafted item does not exist.</p></main>;
  }

  return (
    <main  className="mx-auto max-w-7xl px-4 py-12 md:px-6 bg-white min-h-screen relative z-10"> 
      
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl shadow-stone-300">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <div className="w-full aspect-square relative rounded-lg overflow-hidden shadow-xl border border-stone-200">
            <img 
              src={product.imageUrl} 
              alt={product.name}  
              className="object-cover w-full h-full transition duration-300 hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-col justify-start">
            {/* ... h1, precio, botón, descripción, etc. ... */}
          </div>
        </div>
      </div>
      
      {/* Sección de Reviews */}
      <div className="mt-12 p-6 md:p-10 bg-white rounded-xl shadow-lg shadow-stone-200">
        <ReviewSection productId={productId} />
      </div>

    </main>
  );
}
