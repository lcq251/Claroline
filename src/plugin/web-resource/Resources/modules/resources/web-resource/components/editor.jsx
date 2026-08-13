import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor'
import {ResourceEditor} from '#/main/core/resource/editor'
import {selectors as resourceSelectors} from '#/main/core/resource'

import {ResourceInputsEditor} from '#/integration/mindme-ai/resource/inputs'

/**
 * Editor tab configuring the resources used as inputs of the web resource.
 */
const WebResourceInputs = () => {
  const nodeId = useSelector(resourceSelectors.resourceNode)?.id

  return (
    <EditorPage title={trans('inputs', {}, 'resource')} dataPart="resource">
      {nodeId && <ResourceInputsEditor hostId={nodeId} />}
    </EditorPage>
  )
}

const WebResourceEditor = () =>
  <ResourceEditor
    pages={[
      {
        name: 'inputs',
        title: trans('inputs', {}, 'resource'),
        component: WebResourceInputs
      }
    ]}
  />

export {
  WebResourceEditor
}
