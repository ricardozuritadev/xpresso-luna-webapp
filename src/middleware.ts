import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();

  const isAuthRoute =
    req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up";

  const isProtectedRoute =
    !req.nextUrl.pathname.startsWith("/auth") &&
    !req.nextUrl.pathname.startsWith("/api/auth") &&
    !req.nextUrl.pathname.startsWith("/login") &&
    !isAuthRoute;

  // 🔁 Si hay sesión y entra a /sign-in o /sign-up → redirigir al home
  if (isAuthRoute && session?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 🔒 Si NO hay sesión y entra a ruta protegida → redirigir a /sign-in
  if (isProtectedRoute && !session?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon.ico|.*\\..*).*)"], // protege todo excepto archivos estáticos
};
