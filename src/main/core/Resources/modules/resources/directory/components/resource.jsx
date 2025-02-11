import React from 'react'

import {Resource} from '#/main/core/resource'

import {DirectoryEditor} from '#/main/core/resources/directory/editor/components/main'
import {DirectoryPlayer} from '#/main/core/resources/directory/containers/player'

const DirectoryResource = (props) =>
  <Resource
    {...props}
    editor={DirectoryEditor}
    overviewPage={DirectoryPlayer}
  />

export {
  DirectoryResource
}
