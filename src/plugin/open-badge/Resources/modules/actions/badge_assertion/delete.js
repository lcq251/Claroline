import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {hasPermission} from '#/main/app/security'
import {url} from '#/main/app/api'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans, transChoice} from '#/main/app/intl/translation'

/**
 * Delete assertions action.
 */
export default (assertions, refresher) => {
  const processable = assertions.filter(assertion => hasPermission('delete', assertion))

  return {
    name: 'delete',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash',
    label: trans('delete', {}, 'actions'),
    displayed: !isEmpty(processable),
    dangerous: true,
    confirm: {
      message: transChoice('delete_assertion_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'badge'),
      additional: trans('irreversible_action_confirm'),
      items:  processable.map(item => ({
        thumbnail: get(item, 'user.picture'),
        id: get(item, 'user.id'),
        name: get(item, 'user.name')
      }))
    },
    request: {
      url: url(['apiv2_badge_assertion_delete'], {ids: processable.map(assertion => assertion.id)}),
      request: {
        method: 'DELETE'
      },
      success: () => refresher.delete(processable)
    },
    group: trans('management'),
    scope: ['object', 'collection']
  }
}
