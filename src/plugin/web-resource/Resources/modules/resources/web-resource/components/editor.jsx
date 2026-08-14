import React from 'react'

import {ResourceEditor} from '#/main/core/resource/editor'

/**
 * Web resource editor.
 *
 * The "inputs" configuration entry has been moved to the resource top-right
 * menu ("link resources" button) and is no longer an editor tab.
 */
const WebResourceEditor = () =>
  <ResourceEditor
    pages={[]}
  />

export {
  WebResourceEditor
}
