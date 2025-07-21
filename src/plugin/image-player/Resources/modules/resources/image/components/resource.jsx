import React from 'react'

import {Resource} from '#/main/core/resource'

import {ImagePlayer} from '#/plugin/image-player/resources/image/components/player'
import {ImageEditor} from '#/plugin/image-player/resources/image/components/editor'

const ImageResource = (props) =>
  <Resource
    {...props}
    editor={ImageEditor}
    pages={[
      {
        path: '/',
        exact: true,
        component: ImagePlayer
      }
    ]}
  />

export {
  ImageResource
}
