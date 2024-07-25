import { api } from './api-client'

interface GetOrganizationRequest {
  orgSlug: string
}

interface GetOrganizationResponse {
  organization: {
    slug: string
    id: string
    name: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
    ownerId: string
  }
}

export async function getOrganization({ orgSlug }: GetOrganizationRequest) {
  const result = await api
    .get(`organizations/${orgSlug}`)
    .json<GetOrganizationResponse>()

  return result
}
