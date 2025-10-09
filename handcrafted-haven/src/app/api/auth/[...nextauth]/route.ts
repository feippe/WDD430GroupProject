// src/app/api/auth/[...nextauth]/route.ts
// FINAL FIX: Direct Export of NextAuth Handlers

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; 

// CRITICAL: Copia la configuración de tu archivo src/auth.ts aquí
// (Debe ser idéntica a la que usaste en la solución anterior)

const authOptions = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });
                if (!user || !user.password) return null; 
                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string, 
                    user.password
                );
                if (passwordsMatch) {
                    return { id: user.id, email: user.email, name: user.name, role: user.role };
                }
                return null;
            },
        }),
    ],
    // Copia los callbacks JWT y Session aquí
    callbacks: {
        jwt: ({ token, user }) => {
          if (user) {
            token.role = (user as any).role;
            token.id = user.id;
          }
          return token;
        },
        session: ({ session, token }) => {
          if (session.user) {
            (session.user as any).role = token.role;
            (session.user as any).id = token.id;
          }
          return session;
        },
      },
});


// CRITICAL FIX: EXPORTAMOS LAS PROPIEDADES DIRECTAMENTE DESDE LA CONFIGURACIÓN.
// Esto garantiza que la inicialización ocurre y las propiedades están presentes.
export const { handlers } = authOptions;
export const { GET, POST } = handlers;