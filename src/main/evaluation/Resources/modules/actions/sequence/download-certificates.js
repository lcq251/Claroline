import get from 'lodash/get'

import {constants, declareAction} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {hasPermission} from '#/main/app/security'

export default declareAction((sequences) => ({
  name: 'download_certificates',
  type: ASYNC_BUTTON,
  label: trans('download_certificates', {}, 'actions'),
  request: {
    url: ['apiv2_sequence_download_all_certificates', {sequence: sequences[0].id}]
  },
  displayed: get(sequences[0], 'evaluation.certified', false) && hasPermission('follow', sequences[0]),
  group: trans('evaluation'),
  scope: ['object'],
  set: [constants.ACTION_SET_ADVANCED, constants.ACTION_SET_DASHBOARD],
  title: trans('download_certificates', {}, 'actions'),
  description: trans('download_sequence_certificates_help', {}, 'actions'),
  labelShort: trans('download', {}, 'actions'),
}))
