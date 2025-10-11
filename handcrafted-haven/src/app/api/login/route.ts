import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { email, password } = body;

    // --- 1. Basic Validation ---
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // --- 2. Find the user in the database ---
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // If no user is found, or if the user record has no password (e.g., social login in the future)
    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // --- 3. Compare the provided password with the stored hash ---
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // --- 4. Passwords match! Create the session ---
    session.isLoggedIn = true;
    session.email = user.email;
    session.userId = user.id;
    session.role = user.role;
    await session.save();

    return NextResponse.json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}