import React from 'react'

import {Resource} from '#/main/core/resource'

import {Player} from '#/plugin/web-resource/resources/web-resource/player/components/player'

const WebResource = (props) =>
  <Resource
    {...props}
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
