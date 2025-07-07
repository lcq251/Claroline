import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {route} from '#/main/app/context/routing'
import {constants, declareAction} from '#/main/app/action'

export default declareAction((contexts) => ({
  name: 'configure',
  type: LINK_BUTTON,
  icon: 'fa fa-fw fa-sliders',
  label: trans('configure', {}, 'actions'),
  displayed: -1 !== contexts.findIndex(context => hasPermission('administrate', context)),
  target: `${route(contexts[0].type, contexts[0].slug)}/edit`,
  group: trans('management'),
  scope: ['object'],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
