import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/evaluation/sequence'
import {hasPermission} from '#/main/app/security'
import {constants, declareAction} from '#/main/app/action'

/**
 * Displays a form to modify sequence properties.
 */
export default declareAction((sequences, refresher, path) => ({
  name: 'configure',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-sliders',
  label: trans('configure', {}, 'actions'),
  target: `${route(sequences[0], null, path)}/edit`,
  displayed: -1 !== sequences.findIndex(sequence => hasPermission('edit', sequence)),
  group: trans('management'),
  scope: ['object'],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
