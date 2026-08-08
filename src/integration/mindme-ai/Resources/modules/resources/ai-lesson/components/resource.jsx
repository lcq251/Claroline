import React from 'react'

import {Resource} from '#/main/core/resource'

import {AiLessonPlayer} from '#/integration/mindme-ai/resources/ai-lesson/components/player'
import {AiLessonEditor} from '#/integration/mindme-ai/resources/ai-lesson/components/editor'

const AiLessonResource = (props) =>
  <Resource
    {...props}
    editor={AiLessonEditor}
    pages={{
      path: '/',
      exact: true,
      component: AiLessonPlayer
    }}
  />

export {
  AiLessonResource
}
