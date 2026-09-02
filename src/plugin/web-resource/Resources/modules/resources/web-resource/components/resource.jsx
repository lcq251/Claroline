import React from 'react'

import {Resource} from '#/main/core/resource'

import {WebResourceEditor} from '#/plugin/web-resource/resources/web-resource/components/editor'
import {Player} from '#/plugin/web-resource/resources/web-resource/player/components/player'

const WebResource = (props) =>
  <Resource
    {...props}
    editor={WebResourceEditor}
    pages={[
      {
        path: '/',
        exact: true,
        component: Player
      }
    ]}
  />

export {
  WebResource
}
