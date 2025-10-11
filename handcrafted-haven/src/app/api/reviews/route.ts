import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma'; 
import { NextResponse } from 'next/server';


// -----------------------------------------------------------
// POST: Create a New Review (Any Authenticated User)
// -----------------------------------------------------------
export async function POST(request: Request) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, rating, comment } = body;
    const userId = session.userId;

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: productId,
        userId: userId,
      },
    });

    if (existingReview) {
      return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 409 }); // 409 Conflict
    }

    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment: comment,
        productId: productId,
        userId: userId,
      },
    });

    return NextResponse.json(newReview, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ message: 'Failed to submit review' }, { status: 500 });
  }
}

// -----------------------------------------------------------
// GET: Fetch Reviews for a Specific Product (Public Access)
// -----------------------------------------------------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ message: 'Missing productId parameter.' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true, email: true } } }, 
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews, { status: 200 });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}