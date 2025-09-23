import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');

  // se NÃO tiver token ou ele expirou
  if (!accessToken) {
    const response = NextResponse.redirect(new URL('/login', request.url));

    response.cookies.delete('accessToken');
    response.cookies.delete('user');
    response.cookies.delete('provider');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/meu-perfil/:path*',
    '/minhas-conexoes/:path*',
    '/minhas-oportunidades/:path*',
    '/criar-oportunidade/:path*',
  ],
};
