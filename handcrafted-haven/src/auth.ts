import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

// Assuming 'prisma' is in src/lib/prisma.ts and you are importing it relatively from src/auth.ts
import prisma from './lib/prisma'; 
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcryptjs';

const authConfig = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
      Credentials({
          credentials: {
              email: { label: 'Email', type: 'email' },
              password: { label: 'Password', type: 'password' }
          },
          async authorize(credentials) {
              // 1. Basic validation check
              if (!credentials?.email || !credentials.password) return null;

              // 2. Find user in the database
              const user = await prisma.user.findUnique({
                  where: { email: credentials.email as string },
              });
              
              // User not found or user data is incomplete
              if (!user || !user.password) return null; 

              // 3. Compare the hashed password
              const passwordsMatch = await bcrypt.compare(
                credentials.password as string, 
                user.password
              );

              if (passwordsMatch) {
                // 4. Successful login: Return the user object
                // The object must contain at least the 'id' property.
                // We include 'role' to be used in the JWT callback.
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role, 
                };
              }
              
              // 5. Failed login
              return null;
          },
      }),
  ],
  callbacks: {
    // JWT callback: Adds custom data (like 'role') to the token
    jwt: ({ token, user }) => {
      if (user) {
        // Extend token with user properties
        token.role = (user as any).role;
        token.id = user.id; // Ensure user ID is in the token
      }
      return token;
    },
    // Session callback: Makes custom data available on the client (useSession)
    session: ({ session, token }) => {
      if (session.user) {
        // Extend session user object
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
});

export const { auth, signIn, signOut, handlers } = authConfig;

export default authConfig; 