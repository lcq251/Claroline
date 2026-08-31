import React from 'react'

import {Resource} from '#/main/core/resource'

import {DigitalTeacherPlayer} from '#/integration/mindme-digital/resources/digital-teacher/components/player'
import {DigitalTeacherEditor} from '#/integration/mindme-digital/resources/digital-teacher/components/editor'

const DigitalTeacherResource = (props) =>
  <Resource
    {...props}
    editor={DigitalTeacherEditor}
    pages={[
      {
        path: '/',
        exact: true,
        component: DigitalTeacherPlayer
      }
    ]}
  />

export {
  DigitalTeacherResource
}
