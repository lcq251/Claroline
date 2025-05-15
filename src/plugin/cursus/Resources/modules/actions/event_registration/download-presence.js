import get from 'lodash/get'

import {declareAction} from '#/main/app/action'
import {DOWNLOAD_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'

export default declareAction((registrations) => {
  return ({
    name: 'download-presence',
    type: DOWNLOAD_BUTTON,
    icon: 'fa fa-fw fa-file-pdf',
    label: trans('download_presence', {}, 'cursus'),
    displayed: !!get(registrations[0], 'presence.id') && hasPermission('open', registrations[0]),
    file: {
      url: ['apiv2_cursus_user_presence_download', {id: get(registrations[0], 'presence.id')}]
    },
    group: trans('transfer'),
    scope: ['object']
  })
})
