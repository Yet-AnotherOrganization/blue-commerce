import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdmin = token?.role === 'ADMIN';

        // if trynna go to some admin route then check
        if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
            // and send him to main page if they're not an admin
            return NextResponse.redirect(new URL('/', req.url))
        }
    },

    {
        // this function should only run for those who are logged in
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
)

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*']
}