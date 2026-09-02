import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {constants as toolConstants, declareTool, CommandPalette} from '#/main/core/tool'

import {CommunityTool} from '#/main/community/tools/community/containers/tool'
import {hasPermission} from '#/main/app/security'

/**
 * Community tool.
 *
 * It is available for the Desktop and Workspace contexts.
 * It is used to manage user registrations and other user related entities (e.g., groups, roles, organizations).
 */
export default declareTool(CommunityTool, (tool, contextType, contextData, contextRoles) => {
  return new CommandPalette('community')
    .addPages([
      {
        name: 'users',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-user',
        label: trans('users', {}, 'community'),
        target: `/community/users`,
        displayed: contextType !== toolConstants.TOOL_WORKSPACE || !get(contextData, 'meta.model')
      }, {
        name: 'groups',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-users',
        label: trans('groups', {}, 'community'),
        target: `/community/groups`,
        displayed: contextType !== toolConstants.TOOL_WORKSPACE || !get(contextData, 'meta.model')
      }, {
        name: 'teams',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-user-group',
        label: trans('teams', {}, 'community'),
        target: `/community/teams`,
        displayed: contextType === toolConstants.TOOL_WORKSPACE
      }, {
        name: 'roles',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-id-badge',
        label: trans('roles', {}, 'community'),
        target: `/community/roles`,
        displayed: hasPermission('edit', tool)
      }
    ])
    .addCommands([
      {
        name: 'add-user',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-user',
        label: trans('add_user', {}, 'command'),
        callback: () => true,
        group: trans('community', {}, 'tools')
      }, {
        name: 'add-group',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-users',
        label: trans('add_group', {}, 'command'),
        callback: () => true,
        group: trans('community', {}, 'tools')
      }, {
        name: 'add-role',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-id-badge',
        label: trans('add_role', {}, 'command'),
        callback: () => true,
        group: trans('community', {}, 'tools')
      }, {
        name: 'view-as',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-mask',
        label: trans('view_as', {}, 'command'),
        callback: () => true,
        group: trans('community', {}, 'tools')
      }
    ])
})
  .addPermissions({
    follow: {
      order: 5,
      actions: [
        'Inscrire des utilisateurs',
        'Voir le tableau de bord de l\'outil'
      ]
    },
    administrate: {
      order: 15,
      actions: [
        'Désactiver les utilisateurs inactifs'
      ]
    }
  })
