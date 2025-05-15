import {declareAction} from '#/main/app/action'
import {URL_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

export default declareAction((sessions) => ({
  name: 'export-pdf',
  type: URL_BUTTON,
  icon: 'fa fa-fw fa-file-pdf',
  label: trans('export-pdf', {}, 'actions'),
  displayed: hasPermission('open', sessions[0]),
  target: ['apiv2_cursus_session_download_pdf', {id: sessions[0].id}],
  scope: ['object'],
  group: trans('transfer')
}))
