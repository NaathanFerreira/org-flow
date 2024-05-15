import { z } from 'zod'

// tuple: arrays with 2 positions
// first position of the tuple are the actions, the second position is the Subject name
export const organizationSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownersihp'),
  ]),
  z.literal('Organization'),
])

// first position of the array are the actions, the second position is the Subject name
export type OrganizationSubject = z.infer<typeof organizationSubject>
