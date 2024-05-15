import { z } from 'zod'

// tuple: arrays with 2 positions
// first position of the tuple are the actions, the second position is the Subject name
export const billingSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('export')]),
  z.literal('Billing'),
])

// first position of the array are the actions, the second position is the Subject name
export type BillingSubject = z.infer<typeof billingSubject>
