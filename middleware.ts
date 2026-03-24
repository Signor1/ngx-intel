import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard")
  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL("/", req.url))
  }
})

export const config = {
  matcher: ["/dashboard/:path*"],
}
