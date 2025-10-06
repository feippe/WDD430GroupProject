// /src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'; // Importa los handlers desde /auth.ts

export const { GET, POST } = handlers;