import { defineAbilityFor } from '@saas/auth'

const ability = defineAbilityFor({ role: 'MEMBER' })

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteOthenUsers = ability.can('delete', 'User')

console.log('userCanInviteSomeoneElse', userCanInviteSomeoneElse)
console.log('userCanDeleteOthenUsers', userCanDeleteOthenUsers)