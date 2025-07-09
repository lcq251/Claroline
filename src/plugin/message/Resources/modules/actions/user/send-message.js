import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_MESSAGE} from '#/plugin/message/modals/message'
import {constants} from '#/main/app/action'

export default (users, usersRefresher, path, currentUser) => {
  const processable = users.filter(user => currentUser && user.id !== currentUser.id)

  return {
    name: 'send-message',
    type: MODAL_BUTTON,
    icon: 'fa fa-fw fa-paper-plane',
    label: trans('send-message', {}, 'actions'),
    modal: [MODAL_MESSAGE, {
      receivers: {
        users: processable
      }
    }],
    displayed: 0 !== processable.length,
    scope: ['object', 'collection'],
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
  }
}
