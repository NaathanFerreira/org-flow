import { api } from './api-client'

interface ShutdownOrganizationRequest {
  orgSlug: string
}

type ShutdownOrganizationResponse = void

export async function shutdownOrganization({
  orgSlug,
}: ShutdownOrganizationRequest): Promise<ShutdownOrganizationResponse> {
  await api.delete(`organizations/${orgSlug}`)
}
