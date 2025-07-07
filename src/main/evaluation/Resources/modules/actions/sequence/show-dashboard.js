import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/evaluation/sequence/routing'
import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

export default declareAction((sequences, refresher, path) => ({
  name: 'show-dashboard',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-gauge',
  label: trans('show_dashboard', {}, 'actions'),
  target: route(sequences[0], null, path) + '/dashboard',
  displayed: -1 !== sequences.findIndex(sequence => hasPermission('follow', sequence)),
  scope: ['object'],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
