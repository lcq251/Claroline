import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/evaluation/sequence/routing'
import {declareAction} from '#/main/app/action'

/**
 * Opens a sequence.
 */
export default declareAction((sequences, refresher, path) => ({
  name: 'open',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-arrow-up-right-from-square',
  label: trans('open', {}, 'actions'),
  target: route(sequences[0], null, path),
  scope: ['object'],
  default: true
}))
