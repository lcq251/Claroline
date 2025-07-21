import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor} from '#/main/core/resource'

import {AudioEditorParameters} from '#/plugin/audio-player/resources/audio/editor/components/parameters'
import {AudioEditorOverview} from '#/plugin/audio-player/resources/audio/editor/components/overview'

const AudioEditor = () =>
  <ResourceEditor
    overviewPage={AudioEditorOverview}
    pages={[
      {
        name: 'parameters',
        title: trans('parameters'),
        component: AudioEditorParameters
      }
    ]}
  />

export {
  AudioEditor
}
