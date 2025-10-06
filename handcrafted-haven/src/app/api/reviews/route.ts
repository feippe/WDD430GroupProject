// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth'; 
import prisma from '@/lib/prisma'; 

// -----------------------------------------------------------
// POST: Create a New Review (Any Authenticated User)
// -----------------------------------------------------------
export async function POST(request: Request) {
  const session = await auth();

  // 1. Authentication Check (any user)
  if (!session) {
    return NextResponse.json({ message: 'Authorization required: Must be signed in to leave a review.' }, { status: 401 });
  }

  const userId = session.user.id;
  const data = await request.json();
  const { productId, rating, comment } = data;

  try {
    // Basic validation (rating is a number between 1 and 5)
    const numericRating = parseInt(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ message: 'Invalid rating value.' }, { status: 400 });
    }

    // 2. Prevent duplicate reviews
    const existingReview = await prisma.review.findFirst({
        where: { userId: userId, productId: productId },
    });
    
    if (existingReview) {
        return NextResponse.json({ message: 'You have already reviewed this product.' }, { status: 409 });
    }

    // 3. Execute creation
    const newReview = await prisma.review.create({
      data: {
        productId,
        userId, 
        rating: numericRating,
        comment,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
    
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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