import React from 'react'

import {Resource} from '#/main/core/resource'

import {AibasePlayer} from '#/integration/mindme-aibase/resources/aibase/components/player'
import {AibaseEditor} from '#/integration/mindme-aibase/resources/aibase/components/editor'

const AibaseResource = (props) =>
  <Resource
    {...props}
    editor={AibaseEditor}
    pages={{
      path: '/',
      exact: true,
      component: AibasePlayer
    }}
  />

export {
  AibaseResource
}
