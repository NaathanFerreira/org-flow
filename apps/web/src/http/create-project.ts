import { api } from './api-client'

interface createProjectRequest {
  name: string
  description: string
  orgSlug: string
}

type createProjectResponse = void

export async function createProject({
  name,
  description,
  orgSlug,
}: createProjectRequest): Promise<createProjectResponse> {
  await api.post(`organizations/${orgSlug}/projects`, {
    json: {
      name,
      description,
    },
  })
}
