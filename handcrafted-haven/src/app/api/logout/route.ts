import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}

