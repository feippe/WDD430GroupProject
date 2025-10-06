// /src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Importa el cliente que creamos

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json(); 

    // 1. Validación de existencia
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); 

    // 3. Crear el nuevo usuario (por defecto como 'seller', crucial para tu proyecto)
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'seller', 
      },
    });

    return NextResponse.json({ message: 'Seller registered successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}