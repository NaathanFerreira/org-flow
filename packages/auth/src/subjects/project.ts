import { z } from 'zod'

// tuple: arrays with 2 positions
// first position of the tuple are the actions, the second position is the Subject name
export const projectSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('Project'),
])

// first position of the array are the actions, the second position is the Subject name
export type ProjectSubject = z.infer<typeof projectSubject>