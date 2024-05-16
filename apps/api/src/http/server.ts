import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import {
  authenticateWithPassword,
  createAccount,
  getProfile,
} from './routes/auth'

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
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
})

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
})
app.register(fastifyCors)

// routes
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)

async function run() {
  await app.ready()

  await app.listen({
    port: 3333,
  })

  console.log('HTTP Server Running! 🚀')
  console.log(`Documentation running at http://localhost:3333/documentation`)
}

run()
