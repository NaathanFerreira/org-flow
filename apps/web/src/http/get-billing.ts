import { api } from './api-client'

interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling(org: string) {
  // todo: remove delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const result = await api
    .get(`organizations/${org}/billing`)
    .json<GetBillingResponse>()

  return result
}
