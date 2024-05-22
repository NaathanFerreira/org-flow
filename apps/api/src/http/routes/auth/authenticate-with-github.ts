import { env } from '@saas/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

// docs: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with Github',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            accessToken: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      // to get the code and test manually
      // https://github.com/login/oauth/authorize?client_id=Ov23liyZgWGZmenE0v9m&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email

      const githubOAuthUrl = new URL(
        'https://github.com/login/oauth/access_token',
      )

      // https://github.com/settings/developers -> OAuth apps (client_id, secret and uri)
      githubOAuthUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
      githubOAuthUrl.searchParams.set(
        'client_secret',
        env.GITHUB_OAUTH_CLIENT_SECRET,
      )
      // redirect on front-end (next api route)
      githubOAuthUrl.searchParams.set(
        'redirect_uri',
        env.GITHUB_OAUTH_REDIRECT_URI,
      )
      githubOAuthUrl.searchParams.set('code', code)

      const githubAccessTokenReponse = await fetch(githubOAuthUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessTokenData = await githubAccessTokenReponse.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessTokenData)

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      })

      const githubUserData = await githubUserResponse.json()

      const {
        id: githubId,
        avatar_url: avatarUrl,
        name,
        email,
      } = z
        .object({
          id: z.number().transform(String),
          avatar_url: z.string().url(),
          name: z.string().nullable(),
          email: z.string().email().nullable(),
        })
        .parse(githubUserData)

      if (!email) {
        throw new BadRequestError(
          'Your Github account must have an email to authenticate',
        )
      }

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GITHUB',
            providerAccountId: githubId,
            userId: user.id,
          },
        })
      }

      const accessToken = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ accessToken })
    },
  )
}
