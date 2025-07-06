import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {declareAction} from '#/main/app/action'

export default declareAction((teams, refresher) => {
  const processable = teams.filter(team => hasPermission('edit', team))

  return {
    name: 'fill',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-user-plus',
    label: trans('fill', {}, 'actions'),
    displayed: 0 !== processable.length,
    disabled: !processable.find(team => !get(team, 'restrictions.users') || team.users < get(team, 'restrictions.users')),
    request: {
      url: ['apiv2_team_fill'],
      request: {
        method: 'PUT',
        body: JSON.stringify(processable.map(team => team.id))
      },
      success: () => refresher.update(processable)
    },
    group: trans('management'),
    scope: ['object', 'collection']
  }
})
