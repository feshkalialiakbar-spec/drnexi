import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAuthenticated = request.cookies.has('access_token')
  const userStatus = request.cookies.get('user_status')?.value
  // اینجا  html  بزارم
  // اجازه عبور فایل های استاتیک (css/js/images/fonts و مسیرهای استاتیک)
  const isStaticAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/banks') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/league') ||
    /\.(css|js|map|json|png|jpg|jpeg|svg|ico|webp|gif|woff|woff2|ttf|eot|html)$/i.test(
      pathname
    )
  if (isStaticAsset) {
    return NextResponse.next()
  }
  // مسیرهایی که نیاز به لاگین دارن
  const publicPaths = [
    '/questions',
    '/auth/sign-up',
    '/test',
    '/error',
    '/success',
    '/pay',
    '/payment.html',
    '/api/newPayment',
    '/payment',
    '/api/paymaylinclubarzesh',
    '/api/get-receipt',
    '/atministiyaramiyeytor/Loginatimn',
    '/failed',
    '/products',
  ]

  if (!publicPaths.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(
        `${process.env.NEXT_PUBLIC_APP_URL || ''}/auth/login`,
        request.url
      )
    )
  }
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_APP_URL || ''}/wallet`, request.url)
    )
  }
  if (userStatus === 'INACTIVE') {
    return NextResponse.redirect(
      new URL(
        `${process.env.NEXT_PUBLIC_APP_URL || ''}/auth/validator`,
        request.url
      )
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|banks|icons|league|auth/login|auth/signup|auth/validator).*)',
  ],
}
