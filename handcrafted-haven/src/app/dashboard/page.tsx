import { redirect } from 'next/navigation';
import AddProductForm from '../../components/AddProductForm';
import SellerProductList from '../../components/SellerProductList';
import { getSellerProducts } from '@/lib/product-actions';
import { getSession } from '@/lib/session';


export default async function SellerDashboardPage() {
  const session = await getSession();

  // Protect the page
  if (!session.isLoggedIn) {
    redirect('/login');
  }

  const products = await getSellerProducts();

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <p className="mb-8">Welcome, {session.userId || session.email}.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <AddProductForm /> {/* Keeps the creation form on the side */}
        </div>

        <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Your Listings ({products?.length || 0})</h2>
            <SellerProductList products={products || []} /> {/* Pass data to Client Component */}
        </div>
      </div>
    </main>
  );
}