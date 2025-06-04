import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export function withAuthProtection() {
  return async function middleware(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  };
}
