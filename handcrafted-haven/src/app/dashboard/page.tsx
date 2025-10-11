import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getSellerProducts } from '@/lib/product-actions'; // Assuming the function is here
import SellerProductList from '@/components/SellerProductList'; // Assuming you have this component

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.isLoggedIn || session.role !== 'seller') {
    redirect('/login');
  }

  const products = await getSellerProducts();

  if ('error' in products) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Could not load your products: {products.error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">{/* Sidebar or other info can go here */}</div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">
            Your Listings ({products.length})
          </h2>
          <SellerProductList products={products} />
        </div>
      </div>
    </div>
  );
}