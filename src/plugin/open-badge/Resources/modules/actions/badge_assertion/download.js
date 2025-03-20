import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {ASYNC_BUTTON} from '#/main/app/buttons'

/**
 * Open assertion action.
 */
export default (assertions) => ({
  name: 'download',
  type: ASYNC_BUTTON,
  icon: 'fa fa-fw fa-download',
  label: trans('download', {}, 'actions'),
  displayed: hasPermission('open', assertions[0]),
  request: {
    url: ['apiv2_badge_assertion_pdf_download', {assertion: assertions[0].id}],
    request: {
      method: 'GET'
    }
  },
  scope: ['object']
})
