import get from 'lodash/get'

import {ASYNC_BUTTON} from '#/main/app/buttons'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Unpublishes some sequences.
 */
export default declareAction((sequences, refresher) => ({
  name: 'unpublish',
  type: ASYNC_BUTTON,
  icon: 'fa fa-fw fa-eye-slash',
  label: trans('unpublish', {}, 'actions'),
  displayed: -1 !== sequences.findIndex(sequence => !!get(sequence, 'meta.published') && hasPermission('edit', sequence)),
  request: {
    type: 'unpublish',
    url: ['apiv2_evaluation_sequence_unpublish'],
    request: {
      method: 'PUT',
      body: JSON.stringify(sequences.map(sequence => sequence.id))
    },
    success: (response) => refresher.update(response)
  },
  group: trans('management'),
  scope: [constants.ACTION_SCOPE_OBJECT, constants.ACTION_SCOPE_COLLECTION],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
