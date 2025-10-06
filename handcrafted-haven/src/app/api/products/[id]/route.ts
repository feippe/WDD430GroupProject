import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';


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
      // include: { reviews: true }, 
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
  const session = await auth();

  // 1. Authentication and Role Verification
  if (!session || session.user.role !== 'seller') {
    return NextResponse.json({ message: 'Forbidden: Only authenticated sellers can update products.' }, { status: 403 });
  }

  const productId = params.id;
  const data = await request.json();
  const userId = session.user.id;

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

    if (!existingProduct || existingProduct.sellerId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You do not own this product.' }, { status: 403 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price && { price: parseFloat(data.price) }), 
        ...(data.category && { category: data.category }),
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
  const session = await auth();

  if (!session || session.user.role !== 'seller') {
    return NextResponse.json({ message: 'Forbidden: Only authenticated sellers can delete products.' }, { status: 403 });
  }

  const productId = params.id;
  const userId = session.user.id;

  try {
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });

    if (!existingProduct || existingProduct.sellerId !== userId) {
      return NextResponse.json({ message: 'Forbidden: You do not own this product.' }, { status: 403 });
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ message: 'Product deleted successfully.' }, { status: 204 });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}