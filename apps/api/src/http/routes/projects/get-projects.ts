import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'List all projects of a organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  description: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().nullable(),
                  organizationId: z.string(),
                  createdAt: z.date(),
                  owner: z.object({
                    id: z.string(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().nullable(),
                  }),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { orgSlug } = await request.params
        const { membership, organization } =
          await request.getUserMembership(orgSlug)

        const { cannot } = await getUserPermissions(userId, membership.role)

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError('You are not allowed to list projects')
        }

        const projects = await prisma.project.findMany({
          where: {
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            ownerId: true,
            avatarUrl: true,
            organizationId: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.status(200).send({ projects })
      },
    )
}
