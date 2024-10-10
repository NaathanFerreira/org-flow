import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import {
  authenticateWithGithub,
  authenticateWithPassword,
  createAccount,
  getProfile,
  requestPasswordRecover,
  resetPassword,
} from './routes/auth'
import { getOrganizationBilling } from './routes/billing/get-organization-billing'
import {
  accpetInvite,
  createInvite,
  getInvite,
  getInvites,
  getPendingInvites,
  rejectInvite,
  revokeInvite,
} from './routes/invites'
import { getMembers, removeMember, updateMember } from './routes/members'
import {
  createOrganization,
  getMembership,
  getOrganization,
  getOrganizations,
  shutdownOrganization,
  transferOrganization,
  updateOrganization,
} from './routes/orgs'
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from './routes/projects'
const app = fastify().withTypeProvider<ZodTypeProvider>()

// docs: https://github.com/turkerdev/fastify-type-provider-zod
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS app with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(fastifyCors)

// auth routes
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(authenticateWithGithub)

// organizations routes
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

// projects routes
app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

// members routes
app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

// invite routes
app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(accpetInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

// billing routes
app.register(getOrganizationBilling)

async function run() {
  await app.ready()

  await app.listen({
    port: env.PORT,
    host: '0.0.0.0',
  })

  console.log('HTTP Server Running! 🚀')
  console.log(`Documentation running at http://localhost:3333/documentation`)
}

run()
