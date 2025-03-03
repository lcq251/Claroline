import React from 'react'

import {Resource} from '#/main/core/resource'

import {AudioPlayer} from '#/plugin/audio-player/resources/audio/components/player'
import {AudioEditor} from '#/plugin/audio-player/resources/audio/editor'

const AudioResource = (props) =>
  <Resource
    {...props}
    overviewPage={AudioPlayer}
    editor={AudioEditor}
    styles={['claroline-distribution-plugin-audio-player-resource']}
  />

export {
  AudioResource
}
