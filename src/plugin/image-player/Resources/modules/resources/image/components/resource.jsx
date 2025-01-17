import React from 'react'

import {Resource} from '#/main/core/resource'

import {ImagePlayer} from '#/plugin/image-player/resources/image/components/player'

const ImageResource = (props) =>
  <Resource
    {...props}
    overviewPage={ImagePlayer}
  />

export {
  ImageResource
}
