import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

// from CASL docs: https://casl.js.org/v6/en/cookbook/roles-with-static-permissions#abilities

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (user, { can }) => {
    can('manage', 'all')
  },
  MEMBER: (user, { can }) => {
    // can('invite', 'User')
    can(['create', 'get'], 'Project')
    can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })
  },
  BILLING: () => {},
}
