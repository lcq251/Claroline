import React from 'react'

import {Resource} from '#/main/core/resource'

import {FileOverview} from '#/main/core/resources/file/components/overview'
import {FileEditor} from '#/main/core/resources/file/editor/components/main'

const FileResource = props =>
  <Resource
    {...props}
    overviewPage={FileOverview}
    editor={FileEditor}
  />

export {
  FileResource
}
