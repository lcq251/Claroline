import React from 'react'

import {ResourceEditorOverview} from '#/main/core/resource/editor/components/overview'

const ScormEditorOverview = () =>
  <ResourceEditorOverview
    locked={[
      'resourceNode.poster',
      'resourceNode.meta.descriptionHtml'
    ]}
  />

export {
  ScormEditorOverview
}
