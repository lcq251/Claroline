import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {URL_BUTTON} from '#/main/app/buttons'
import {constants, declareAction} from '#/main/app/action'

/**
 * Export course into a PDF file.
 */
export default declareAction((courses) => ({
  name: 'export-pdf',
  type: URL_BUTTON,
  icon: 'fa fa-fw fa-download',
  label: trans('download', {}, 'actions'),
  displayed: hasPermission('open', courses[0]),
  target: ['apiv2_cursus_course_download_pdf', {id: courses[0].id}],
  scope: ['object'],
  group: trans('transfer'),
  set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS]
}))
