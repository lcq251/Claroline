import React from 'react'
import {useSelector} from 'react-redux'

import {ResourceEditor} from '#/main/core/resource/editor'

import {selectors} from '#/main/core/resources/directory/store'
import {DirectoryEditorAppearance} from '#/main/core/resources/directory/editor/components/appearance'

const DirectoryEditor = () => {
  const directory = useSelector(selectors.resource)

  return (
    <ResourceEditor
      additionalData={() => ({
        resource: directory
      })}
      appearancePage={DirectoryEditorAppearance}
    />
  )
}

export {
  DirectoryEditor
}
