import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Rutas públicas
  // Keep login (and other auth pages) public to avoid redirect loops when no token is present
  const publicPaths = ["/", "/results", "/auth/login"];

  // Si no hay token y la ruta NO es pública, redirige
  if (!token && !publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Aplica a todas las rutas excepto estáticos y API
export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
