import {declareAction} from '#/main/app/action'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {ASYNC_BUTTON} from '#/main/app/buttons'

export default declareAction((teams, refresher) => {
  const processable = teams.filter(team => hasPermission('edit', team) && team.users > 0)

  return {
    name: 'empty',
    type: ASYNC_BUTTON,
    icon: 'fa fa-fw fa-user-minus',
    label: trans('empty', {}, 'actions'),
    displayed: 0 !== processable.length,
    request: {
      url: ['apiv2_team_empty'],
      request: {
        method: 'DELETE',
        body: JSON.stringify(processable.map(team => team.id))
      },
      success: () => refresher.update(processable)
    },
    dangerous: true,
    group: trans('management'),
    scope: ['object', 'collection']
  }
})
