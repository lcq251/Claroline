import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {DOWNLOAD_BUTTON} from '#/main/app/buttons'
import {url} from '#/main/app/api'
import {hasPermission} from '#/main/app/security'

import {supportDownload} from '#/main/core/resource/utils'
import {constants, declareAction} from '#/main/app/action'

/**
 * Downloads resource nodes.
 *
 * @param {Array} resourceNodes - the list of resource nodes on which we want to execute the action.
 */
export default declareAction((resourceNodes) => {
  const processable = resourceNodes.filter(resourceNode =>
    hasPermission('open', resourceNode)
    && supportDownload(resourceNode)
    && get(resourceNode, 'meta.downloadable', false)
  )

  return {
    name: 'download',
    type: DOWNLOAD_BUTTON,
    icon: 'fa fa-fw fa-download',
    label: trans('download', {}, 'actions'),
    displayed: 0 !== processable.length,
    scope: ['object', 'collection'],
    file: {
      url: url(
        ['claro_resource_download'],
        {ids: processable.map(resourceNode => resourceNode.id)}
      )
    },
    set: [constants.ACTION_SET_LIST, constants.ACTION_SET_DETAILS],
    primary: true
  }
})
