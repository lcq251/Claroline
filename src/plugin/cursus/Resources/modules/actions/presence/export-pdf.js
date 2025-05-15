import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {DOWNLOAD_BUTTON} from '#/main/app/buttons'
import {declareAction} from '#/main/app/action'

/**
 * Export presence into PDF file.
 */
export default declareAction((presences) => ({
  name: 'export-pdf',
  type: DOWNLOAD_BUTTON,
  icon: 'fa fa-fw fa-file-pdf',
  label: trans('download_presence', {}, 'cursus'),
  file: {
    url: ['apiv2_cursus_user_presence_download', {id: presences[0].id}]
  },
  displayed: hasPermission('open', presences[0]),
  group: trans('transfer'),
  scope: ['object']
}))
