import get from 'lodash/get'

import {constants, declareAction} from '#/main/app/action'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

export default declareAction((sequences) => ({
  name: 'regenerate_certificates',
  type: ASYNC_BUTTON,
  label: trans('regenerate_certificates', {}, 'actions'),
  request: {
    url: ['apiv2_sequence_regenerate_all_certificates', {sequence: sequences[0].id}],
    request: {
      method: 'PUT'
    }
  },
  displayed: get(sequences[0], 'evaluation.certified', false) && hasPermission('follow', sequences[0]),
  group: trans('evaluation'),
  scope: ['object'],
  set: [constants.ACTION_SET_ADVANCED, constants.ACTION_SET_DASHBOARD],
  title: trans('regenerate_certificates', {}, 'actions'),
  description: trans('regenerate_sequence_certificates_help', {}, 'actions'),
  labelShort: trans('regenerate', {}, 'actions'),
}))
