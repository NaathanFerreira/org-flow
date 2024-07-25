import { api } from './api-client'

interface updateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  orgSlug: string
}

type updateOrganizationResponse = void

export async function updateOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
  orgSlug,
}: updateOrganizationRequest): Promise<updateOrganizationResponse> {
  console.log(domain)
  await api.put(`organizations/${orgSlug}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
