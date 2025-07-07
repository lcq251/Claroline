import {constants, declareAction} from '#/main/app/action'
import {ASYNC_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

export default declareAction((users, refresher, path, currentUser) => ({
  name: 'export',
  icon: 'fa fa-fw fa-download',
  label: trans('export_data', {}, 'privacy'),
  type: ASYNC_BUTTON,
  request: {
    url: ['apiv2_profile_export']
  },
  displayed: currentUser && currentUser.id === users[0].id,
  scope: ['object'],
  group: trans('transfer'),
  set: [constants.ACTION_SET_ADVANCED],
  title: trans('export_data', {}, 'privacy'),
  description: trans('export_data_desc', {}, 'privacy'),
  labelShort: trans('export', {}, 'actions'),
}))
