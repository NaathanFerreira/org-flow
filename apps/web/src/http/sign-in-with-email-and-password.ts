import { api } from './api-client'

interface SignInWithEmailAndPasswordRequest {
  email: string
  password: string
}

interface SignInWithEmailAndPasswordResponse {
  accessToken: string
}

export async function signInWithEmailAndPassword({
  email,
  password,
}: SignInWithEmailAndPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SignInWithEmailAndPasswordResponse>()

  return result
}
