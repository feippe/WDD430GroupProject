import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';


type RouteParams = { 
  params: { id: string } 
};

// -----------------------------------------------------------
// GET: Read a Specific Product (Public Access)
// -----------------------------------------------------------
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const productId = params.id;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// -----------------------------------------------------------
// PUT: Update a Product (Seller Owner Only)
// -----------------------------------------------------------
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getSession();

  if (!session.isLoggedIn || session.role !== 'seller') {
    return NextResponse.json({ message: 'Forbidden: Only authenticated sellers can update products.' }, { status: 403 });
  }

  const productId = params.id;
  const data = await request.json();
  const userId = session.userId;

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

    if (!existingProduct || existingProduct.sellerId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You do not own this product.' }, { status: 403 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? parseFloat(data.price) : undefined,
        category: data.category,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// -----------------------------------------------------------
// DELETE: Delete a Product (Seller Owner Only)
// -----------------------------------------------------------
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getSession();

  if (!session.isLoggedIn || session.role !== 'seller') {
    return NextResponse.json({ message: 'Forbidden: Only authenticated sellers can delete products.' }, { status: 403 });
  }

  const productId = params.id;
  const userId = session.userId;

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

    if (!existingProduct || existingProduct.sellerId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You do not own this product.' }, { status: 403 });
    }

    await prisma.product.delete({ where: { id: productId } });

    return new NextResponse(null, { status: 204 }); 

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}