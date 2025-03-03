import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor} from '#/main/core/resource'

import {selectors} from '#/plugin/audio-player/resources/audio/store'
import {AudioEditorParameters} from '#/plugin/audio-player/resources/audio/editor/components/parameters'

const AudioEditor = () => {
  const audio = useSelector(selectors.resource)

  return (
    <ResourceEditor
      additionalData={() => ({
        resource: audio
      })}
      pages={[
        {
          name: 'parameters',
          title: trans('parameters'),
          component: AudioEditorParameters
        }
      ]}
    />
  )
}

export {
  AudioEditor
}
