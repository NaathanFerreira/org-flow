'use server'

import { signInWithEmailAndPassword } from '@/http/sign-in-with-email-and-password'

export async function signInWithEmailAndPasswordAction(data: FormData) {
  const { email, password } = Object.fromEntries(data)

  const { accessToken } = await signInWithEmailAndPassword({
    email: String(email),
    password: String(password),
  })

  console.log(accessToken)
  return accessToken
}
