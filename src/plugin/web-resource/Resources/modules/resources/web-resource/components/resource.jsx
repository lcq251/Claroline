import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {Resource} from '#/main/core/resource'
import {selectors as resourceSelectors} from '#/main/core/resource'

import {WebResourceEditor} from '#/plugin/web-resource/resources/web-resource/components/editor'
import {Player} from '#/plugin/web-resource/resources/web-resource/player/components/player'
import {MODAL_LINK_RESOURCES} from '#/plugin/web-resource/resources/web-resource/modals/inputs'

const WebResource = (props) => {
  const canEdit = useSelector(resourceSelectors.canEdit)
  const nodeId = useSelector(resourceSelectors.resourceNode)?.id

  return (
    <Resource
      {...props}
      editor={WebResourceEditor}
      actions={[
        {
          name: 'link-inputs',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-link',
          label: trans('link_resources', {}, 'resource'),
          displayed: canEdit,
          modal: [MODAL_LINK_RESOURCES, {hostId: nodeId}]
        }
      ]}
      pages={[
        {
          path: '/',
          exact: true,
          component: Player
        }
      ]}
    />
  )
}

export {
  WebResource
}
