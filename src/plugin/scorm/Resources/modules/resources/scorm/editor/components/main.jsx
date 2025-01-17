import React from 'react'
import {useSelector} from 'react-redux'

import {ResourceEditor} from '#/main/core/resource/editor'

import {selectors} from '#/plugin/scorm/resources/scorm/store'
import {ScormEditorAppearance} from '#/plugin/scorm/resources/scorm/editor/components/appearance'
import {ScormEditorOverview} from '#/plugin/scorm/resources/scorm/editor/components/overview'

const ScormEditor = () => {
  const scorm = useSelector(selectors.scorm)

  return (
    <ResourceEditor
      overviewPage={ScormEditorOverview}
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
