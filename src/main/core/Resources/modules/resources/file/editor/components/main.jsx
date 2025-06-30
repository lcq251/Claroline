import React from 'react'
import {useSelector} from 'react-redux'

import {ResourceEditor} from '#/main/core/resource/editor'

import {selectors} from '#/main/core/resources/file/store'
import {FileEditorAppearance} from '#/main/core/resources/file/editor/components/appearance'

const FileEditor = () => {
  const file = useSelector(selectors.file)

  return (
    <ResourceEditor
      additionalData={() => ({
        resource: file
      })}
      appearancePage={FileEditorAppearance}
    />
  )
}

export {
  FileEditor
}
