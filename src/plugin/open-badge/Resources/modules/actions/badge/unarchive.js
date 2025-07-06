import get from 'lodash/get'

import {ASYNC_BUTTON} from '#/main/app/buttons'
import {url} from '#/main/app/api'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

export default (badges, refresher) => {
  const processable = badges.filter(badge => hasPermission('edit', badge) && get(badge, 'meta.archived'))

  return {
    name: 'unarchive',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-box-open',
    label: trans('unarchive', {}, 'actions'),
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
}
