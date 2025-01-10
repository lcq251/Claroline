import React from 'react'

import {Resource} from '#/main/core/resource'

import {VideoPlayer} from '#/plugin/video-player/resources/video/containers/player'

const VideoResource = (props) =>
  <Resource
    {...props}
    pages={[
      {
        path: '/',
        exact: true,
        component: VideoPlayer
      }
    ]}
  />

export {
  VideoResource
}
