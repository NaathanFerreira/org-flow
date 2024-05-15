import { z } from 'zod'

// tuple: arrays with 2 positions
// first position of the tuple are the actions, the second position is the Subject name
export const inviteSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('delete'),
  ]),
  z.literal('Invite'),
])

// first position of the array are the actions, the second position is the Subject name
export type InviteSubject = z.infer<typeof inviteSubject>
