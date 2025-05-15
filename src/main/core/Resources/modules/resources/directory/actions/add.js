import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_RESOURCE_CREATION} from '#/main/core/resource/modals/creation'
import {constants, declareAction} from '#/main/app/action'

export default declareAction((resourceNodes, nodesRefresher) => ({
  name: 'add',
  type: MODAL_BUTTON,
  label: trans('add_resource', {}, 'actions'),
  icon: 'fa fa-fw fa-plus',
  primary: true,
  modal: [MODAL_RESOURCE_CREATION, {
    parent: resourceNodes[0],
    add: (newNode) => nodesRefresher.add([newNode])
  }],
  displayed: resourceNodes[0].permissions.create.length > 0,
  scope: [constants.ACTION_SCOPE_OBJECT],
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
