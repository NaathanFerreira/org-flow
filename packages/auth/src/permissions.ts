import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'

// from CASL docs: https://casl.js.org/v6/en/cookbook/roles-with-static-permissions#abilities

type Roles = 'ADMIN' | 'MEMBER'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Roles, PermissionsByRole> = {
  ADMIN: (user, { can }) => {
    // ADMINS can manage all entities/subjects
    can('manage', 'all')
  },
  MEMBER: (user, { can }) => {
    // MEMBERS can invite other members
    can('invite', 'User')
    can('create', 'Project')
  },
}
