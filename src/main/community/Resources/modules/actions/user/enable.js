import get from 'lodash/get'

import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {declareAction} from '#/main/app/action'

export default declareAction((users, refresher) => {
  const processable = users.filter(user => hasPermission('administrate', user) && get(user, 'restrictions.disabled', false))

  return {
    name: 'enable',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-user-check',
    label: trans('enable', {}, 'actions'),
    scope: ['object', 'collection'],
    displayed: 0 !== processable.length,
    request: {
      url: ['apiv2_user_enable'],
      request: {
        method: 'PUT',
        body: JSON.stringify(processable.map(u => u.id))
      },
      success: (response) => refresher.update(response)
    },
    group: trans('management'),
    primary: true
  }
})
