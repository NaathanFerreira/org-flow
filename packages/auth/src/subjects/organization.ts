import { z } from 'zod'

import { organizationSchema } from '../models/organization'

// tuple: arrays with 2 positions
// first position of the tuple are the actions, the second position is the Subject name
export const organizationSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownersihp'),
  ]),
  z.union([z.literal('Organization'), organizationSchema]),
])

// first position of the array are the actions, the second position is the Subject name
export type OrganizationSubject = z.infer<typeof organizationSubject>
