import React from 'react'

import {Resource} from '#/main/core/resource'

import {VideoPlayer} from '#/plugin/video-player/resources/video/components/player'
import {VideoEditor} from '#/plugin/video-player/resources/video/components/editor'

const VideoResource = (props) =>
  <Resource
    {...props}
    editor={VideoEditor}
    pages={{
      path: '/',
      exact: true,
      component: VideoPlayer
    }}
  />

export {
  VideoResource
}
