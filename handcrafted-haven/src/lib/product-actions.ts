import prisma from '@/lib/prisma';
import { auth } from '../auth';

/**
 * Fetches all products belonging to the authenticated seller.
 * @returns An array of products or null if not authorized.
 */
export async function getSellerProducts() {
  const session = await auth();
 
  // Security check: must be a seller
  if (!session || session.user.role !== 'seller') {
    return null; 
  }

  try {
    const products = await prisma.product.findMany({
        where: { sellerId: session.user.id },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            price: true,
            description: true,
            category: true,
            imageUrl: true,
            createdAt: true,
        }
    });
    
    return products;
  } catch (error) {
    console.error('DATABASE_ERROR: Failed to fetch seller products.', error);
    throw new Error('Failed to fetch seller products.'); 
  }
}