import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { APP_BASE } from "@/lib/routes";

export default withAuth(
  function middleware(req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith(`${APP_BASE}/admin`);
    const role = req.nextauth.token?.role;

    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL(`${APP_BASE}/dashboard`, req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: `${APP_BASE}/login`,
    },
  }
);

// O matcher precisa ser um array de literais estáticos — o Next.js analisa
// esse valor em build-time e ignora expressões dinâmicas, então o prefixo
// não pode vir de APP_BASE aqui (mesmo sendo o mesmo valor "/curriculo-certo").
export const config = {
  matcher: ["/curriculo-certo/dashboard/:path*", "/curriculo-certo/admin/:path*"],
};
