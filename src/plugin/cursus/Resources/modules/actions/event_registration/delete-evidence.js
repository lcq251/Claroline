import {hasPermission} from '#/main/app/security'
import {url} from '#/main/app/api'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl/translation'
import {declareAction} from '#/main/app/action'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

/**
 * Delete evidence action.
 */
export default declareAction((registrations, refresher) => {
  return {
    name: 'delete-evidence',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash',
    label: trans('delete_evidence', {}, 'presence'),
    displayed: hasPermission('edit', registrations[0]) && !isEmpty(get(registrations[0], 'presence.evidences')),
    dangerous: true,
    confirm: {
      title: trans('delete_evidence', {}, 'presence'),
      message: trans('delete_evidence_message', {}, 'presence')
    },
    request: {
      url: url(['apiv2_cursus_presence_evidence_delete', {id: get(registrations[0], 'presence.id')}]),
      request: {
        method: 'DELETE'
      },
      success: () => refresher.update(registrations[0])
    },
    group: trans('management'),
    scope: ['object']
  }
})
