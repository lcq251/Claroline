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
 * It is used to manage users registrations and other user related entities (eg. groups, roles, organizations).
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
        label: trans('Ajouter un utilisateur', {}, 'command'),
        callback: () => true,
        group: trans('community', {}, 'tools')
      }, {
        name: 'add-group',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-users',
        label: trans('Ajouter un groupe', {}, 'command'),
        callback: () => true,
        group: trans('community', {}, 'tools')
      }, {
        name: 'add-role',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-id-badge',
        label: trans('Ajouter un rôle', {}, 'command'),
        callback: () => true,
        group: trans('community', {}, 'tools')
      }, {
        name: 'view-as',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-mask',
        label: trans('Voir en tant que', {}, 'command'),
        callback: () => true,
        group: trans('community', {}, 'tools')
      }
    ])
})
