'use server'

import { redirect } from 'next/navigation'

export async function signInWithGithubAction() {
  const githubSignInURL = new URL('login/oauth/authorize', 'http://github.com')

  githubSignInURL.searchParams.set('client_id', 'Ov23liyZgWGZmenE0v9m')
  githubSignInURL.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback',
  )
  githubSignInURL.searchParams.set('scope', 'user')

  redirect(githubSignInURL.toString())
}
