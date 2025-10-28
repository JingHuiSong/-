export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/products/:path*",
    "/quotes/:path*",
    "/orders/:path*",
    "/approvals/:path*",
    "/knowledge/:path*",
    "/settings/:path*",
    "/staff/:path*",
    "/departments/:path*",
    "/audit-logs/:path*",
    "/profile/:path*",
    "/ai-chat/:path*",
  ],
};

