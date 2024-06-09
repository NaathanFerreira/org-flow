import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { signInWithGithub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // github redirect callback code
  // http://localhost:3000/api/auth/callback?code=8c56e68a5aa71463646c
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      {
        message: 'Github OAuth code was not found.',
      },
      { status: 400 },
    )
  }

  const { accessToken } = await signInWithGithub({ code })

  cookies().set('token', accessToken, {
    path: '/',
    maxAge: 60 * 60 * 60 * 24 * 7, // 7 days
  })

  const redirectUrl = request.nextUrl.clone()

  // redirect to home
  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
