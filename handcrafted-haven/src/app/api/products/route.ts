import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
import { getSession } from '@/lib/session'; 

// -----------------------------------------------------------
// POST: Create a New Product (Seller Only)
// -----------------------------------------------------------
export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== 'seller') {
    return NextResponse.json({ message: 'Forbidden: Only sellers can create products.' }, { status: 403 });
  }

  try {
    const data = await request.json();
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        imageUrl: data.imageUrl,
        sellerId: session.userId, // Assign product to the logged-in seller
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}