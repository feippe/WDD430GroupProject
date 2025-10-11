import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReviewSection from '@/components/ReviewSection';
import { getSession } from '@/lib/session'; // <-- 1. AÑADE ESTA LÍNEA

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
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 bg-white min-h-screen relative z-10"> 
      
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
            {/* ... tu contenido de producto (h1, precio, botón, etc.) ... */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl text-gray-700 mt-2">${product.price}</p>
            <p className="mt-4 text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>
      
      {/* Sección de Reviews */}
      <div className="mt-12 p-6 md:p-10 bg-white rounded-xl shadow-lg shadow-stone-200">
        <ReviewSection productId={productId} isLoggedIn={session.isLoggedIn ?? false} />
      </div>

    </main>
  );
}