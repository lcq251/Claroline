import React from 'react'

import {Resource} from '#/main/core/resource'

import {AiteacherPlayer} from '#/integration/mindme-aibase/resources/aiteacher/components/player'
import {AiteacherEditor} from '#/integration/mindme-aibase/resources/aiteacher/components/editor'

const AiteacherResource = (props) =>
  <Resource
    {...props}
    editor={AiteacherEditor}
    pages={{
      path: '/',
      exact: true,
      component: AiteacherPlayer
    }}
  />

export {
  AiteacherResource
}
