import React from 'react'

import {ResourceEditor} from '#/main/core/resource/editor'

import {DirectoryEditorAppearance} from '#/main/core/resources/directory/editor/components/appearance'

const DirectoryEditor = () =>
  <ResourceEditor
    appearancePage={DirectoryEditorAppearance}
  />

export {
  DirectoryEditor
}
