import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  ForcedSubject,
  MongoAbility,
} from '@casl/ability'

const actions = ['manage', 'invite', 'delete'] as const
const subjects = ['User', 'all'] as const
type AppAbilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
]

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>
// code above documentation: https://casl.js.org/v6/en/cookbook/roles-with-static-permissions#abilities

const { build, can, cannot } = new AbilityBuilder(createAppAbility)

// by default, cannot is set for all, nobody can do nothing

can('invite', 'User')
cannot('delete', 'User') // just for readability

export const ability = build()
