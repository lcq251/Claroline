import get from 'lodash/get'

import {ASYNC_BUTTON} from '#/main/app/buttons'
import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {constants, declareAction} from '#/main/app/action'

/**
 * Unarchives some workspaces.
 *
 * @param {Array}  workspaces - the list of workspaces on which we want to execute the action.
 * @param {object} refresher  - an object containing methods to update context in response to action (e.g., add, update, delete).
 */
export default declareAction((workspaces, refresher) => {
  const processable = workspaces.filter(workspace => hasPermission('archive', workspace) && get(workspace, 'meta.archived'))

  return {
    name: 'restore',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash-restore-alt',
    label: trans('restore', {}, 'actions'),
    displayed: 0 !== processable.length,
    request: {
      url: ['apiv2_workspace_restore'],
      request: {
        method: 'PUT',
        body: JSON.stringify(processable.map(workspace => workspace.id))
      },
      success: (response) => refresher.update(response)
    },
    group: trans('management'),
    scope: ['object', 'collection'],
    dangerous: true,
    title: trans('restore_workspace', {}, 'actions'),
    description: trans('restore_workspace_desc', {}, 'actions'),
    managerOnly: true,
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED]
  }
})
