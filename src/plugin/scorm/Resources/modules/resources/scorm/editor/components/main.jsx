import React from 'react'
import {useSelector} from 'react-redux'

import {ResourceEditor} from '#/main/core/resource/editor'

import {selectors} from '#/plugin/scorm/resources/scorm/store'
import {ScormEditorAppearance} from '#/plugin/scorm/resources/scorm/editor/components/appearance'

const ScormEditor = () => {
  const scorm = useSelector(selectors.scorm)

  return (
    <ResourceEditor
      appearancePage={ScormEditorAppearance}
      additionalData={() => ({
        resource: scorm
      })}
    />
  )
}

export {
  ScormEditor
}
