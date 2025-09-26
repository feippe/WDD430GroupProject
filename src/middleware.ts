import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: Request) {
  const session = await auth();
  const url = new URL(req.url);

  if (url.pathname.startsWith("/dashboard")) {
    if (!session) return NextResponse.redirect(new URL("/signin", url));
    // si necesitás que sea seller:
    // if (session.user.role !== "SELLER") return NextResponse.redirect(new URL("/", url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
