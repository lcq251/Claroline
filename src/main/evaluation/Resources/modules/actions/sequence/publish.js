import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {constants, declareAction} from '#/main/app/action'

/**
 * Publishes some sequences.
 */
export default declareAction((sequences, refresher) => ({
  name: 'publish',
  type: ASYNC_BUTTON,
  icon: 'fa fa-fw fa-eye',
  label: trans('publish', {}, 'actions'),
  displayed: -1 !== sequences.findIndex(sequence => !get(sequence, 'meta.published') && hasPermission('edit', sequence)),
  request: {
    type: 'publish',
    url: ['apiv2_evaluation_sequence_publish'],
    request: {
      method: 'PUT',
      body: JSON.stringify(sequences.map(sequence => sequence.id))
    },
    success: (response) => refresher.update(response)
  },
  group: trans('management'),
  scope: [constants.ACTION_SCOPE_OBJECT, constants.ACTION_SCOPE_COLLECTION],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED]
}))
