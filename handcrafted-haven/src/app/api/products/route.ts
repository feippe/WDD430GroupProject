import { NextResponse } from 'next/server';
import { auth } from '@/auth'; 
import prisma from '@/lib/prisma'; 

// -----------------------------------------------------------
// POST: Create a New Product (Seller Only)
// -----------------------------------------------------------
export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== 'seller') {
    return NextResponse.json({ message: 'Forbidden: Only sellers can create products.' }, { status: 403 });
  }

  const userId = session.user.id;
  const data = await request.json();

  try {
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        sellerId: userId, 
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// -----------------------------------------------------------
// GET: Fetch All Products (Public Access) - Placeholder if not done
// -----------------------------------------------------------
// export async function GET(request: Request) {
//   try {
//     const products = await prisma.product.findMany({});
//     return NextResponse.json(products, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }