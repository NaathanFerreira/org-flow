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
import {
  createOrganization,
  getMembership,
  getOrganization,
  getOrganizations,
} from './routes/orgs'
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

async function run() {
  await app.ready()

  await app.listen({
    port: env.SERVER_PORT,
  })

  console.log('HTTP Server Running! 🚀')
  console.log(`Documentation running at http://localhost:3333/documentation`)
}

run()
