import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'
import {LogOperationalList} from '#/main/log/components/operational-list'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

const ResourceEditorHistory = () => {
  const resourceId = useSelector(resourceSelectors.id)

  return (
    <EditorPage
      title={trans('history')}
      help={trans('resource_history_desc', {}, 'resource')}
    >
      <LogOperationalList
        autoload={!!resourceId}
        url={['apiv2_logs_operational_object', {objectName: 'Claroline/CoreBundle/Entity/Resource/ResourceNode', objectId: resourceId}]}
      />
    </EditorPage>
  )
}

export {
  ResourceEditorHistory
}
