import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor} from '#/main/core/resource/editor'
import {LinkResourcesEditor} from '#/plugin/web-resource/resources/web-resource/pages/link-resources-editor'

const WebResourceEditor = () =>
  <ResourceEditor
    pages={[
      {
        name: 'inputs',
        title: trans('linked_resources', {}, 'resource'),
        component: LinkResourcesEditor
      }
    ]}
  />

export {
  WebResourceEditor
}