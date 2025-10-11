// src/lib/session.ts
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// Define la estructura de los datos de tu sesión
export interface SessionData {
  isLoggedIn: boolean;
  email: string;
  userId: string;
  role: string;
}

// Opciones de la cookie de sesión
const sessionOptions = {
  cookieName: 'handcrafted_haven_session',
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// Función para obtener la sesión del lado del servidor
export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

