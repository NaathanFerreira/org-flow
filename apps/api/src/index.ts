import { ability } from '@saas/auth'

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteOthenUsers = ability.can('delete', 'User')

console.log(userCanDeleteOthenUsers)