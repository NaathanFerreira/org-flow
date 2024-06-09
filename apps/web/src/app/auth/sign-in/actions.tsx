'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { signInWithEmailAndPassword } from '@/http/sign-in-with-email-and-password'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address' }),
  password: z.string().min(1, { message: 'Please, provide your password' }),
})

export async function signInWithEmailAndPasswordAction(formData: FormData) {
  const formDataParseResult = signInSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!formDataParseResult.success) {
    const validationErrors = formDataParseResult.error.flatten().fieldErrors

    return { success: false, message: null, errors: validationErrors }
  }

  const { email, password } = formDataParseResult.data

  try {
    const { accessToken } = await signInWithEmailAndPassword({
      email,
      password,
    })

    cookies().set('token', accessToken, {
      path: '/',
      maxAge: 60 * 60 * 60 * 24 * 7, // 7 days
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
