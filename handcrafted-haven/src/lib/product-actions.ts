'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function getSellerProducts() {
  const session = await getSession();

  if (!session.isLoggedIn || session.role !== 'seller') {
    return { error: 'Forbidden' };
  }

  try {
    const products = await prisma.product.findMany({
        where: { sellerId: session.userId },
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