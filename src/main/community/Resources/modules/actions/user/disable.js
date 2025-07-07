import get from 'lodash/get'

import {hasPermission} from '#/main/app/security'
import {trans, transChoice} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {constants, declareAction} from '#/main/app/action'

export default declareAction((users, refresher) => {
  const processable = users.filter(user => hasPermission('administrate', user) && !get(user, 'restrictions.disabled', false))

  return {
    name: 'disable',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-user-xmark',
    label: trans('disable', {}, 'actions'),
    displayed: 0 !== processable.length,
    dangerous: true,
    confirm: {
      message: transChoice('user_disable_confirm_message', processable.length, {count: '<b class="fw-bold">'+processable.length+'</b>'}, 'community'),
      additional: trans('Les utilisateurs désactivés ne peuvent plus se connecter à la plateforme.'),
      items:  processable.map(item => ({
        thumbnail: item.picture,
        name: item.name
      }))
    },
    request: {
      url: ['apiv2_user_disable'],
      request: {
        method: 'PUT',
        body: JSON.stringify(processable.map(u => u.id))
      },
      success: refresher.update
    },
    scope: ['object', 'collection'],
    group: trans('management'),
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS, constants.ACTION_SET_ADVANCED],
    managerOnly: true,
    title: trans('disable_user', {}, 'actions'),
    description: trans('disable_user_desc', {}, 'actions')
  }
})
