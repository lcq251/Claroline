import React from 'react'

import {Resource} from '#/main/core/resource'

import {MindmeMarkdownPlayer} from '#/integration/mindme-ai/resources/mindme-markdown/components/player'
import {MindmeMarkdownEditor} from '#/integration/mindme-ai/resources/mindme-markdown/components/editor'

const MindmeMarkdownResource = (props) =>
  <Resource
    {...props}
    editor={MindmeMarkdownEditor}
    pages={[
      {
        path: '/',
        exact: true,
        component: MindmeMarkdownPlayer
      }
    ]}
  />

export {
  MindmeMarkdownResource
}