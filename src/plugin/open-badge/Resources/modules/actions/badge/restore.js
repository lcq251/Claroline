import get from 'lodash/get'

import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {declareAction} from '#/main/app/action'

export default declareAction((badges, refresher) => {
  const processable = badges.filter(badge => hasPermission('edit', badge) && get(badge, 'meta.archived'))

  return {
    name: 'restore',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-trash-restore-alt',
    label: trans('restore', {}, 'actions'),
    displayed: 0 !== processable.length,
    request: {
      url: ['apiv2_badge_restore'],
      request: {
        method: 'PUT',
        body: JSON.stringify(processable.map(u => u.id))
      },
      success: () => refresher.update(processable)
    },
    scope: ['object', 'collection'],
    group: trans('management'),
    dangerous: true
  }
})
