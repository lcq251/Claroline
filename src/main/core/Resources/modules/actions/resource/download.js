import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {DOWNLOAD_BUTTON} from '#/main/app/buttons'
import {url} from '#/main/app/api'
import {hasPermission} from '#/main/app/security'

import {supportDownload} from '#/main/core/resource/utils'

/**
 * Downloads resource nodes.
 *
 * @param {Array} resourceNodes - the list of resource nodes on which we want to execute the action.
 */
export default (resourceNodes) => {
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
    displayed: !isEmpty(processable),
    scope: ['object', 'collection'],
    file: {
      url: url(
        ['claro_resource_download'],
        {ids: processable.map(resourceNode => resourceNode.id)}
      )
    }
  }
}
