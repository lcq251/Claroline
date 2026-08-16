import React from 'react'
import {ResourceInputsEditor} from '#/integration/mindme-ai/resource/inputs'

/**
 * ResourceInputsEditor wrapper for the web resource editor.
 * Reuses the generic ResourceInputsEditor (load, multi-select, order,
 * delete and save via PUT on the ResourceReference API).
 */
const WebResourceInputsEditor = (props) => {
  return <ResourceInputsEditor {...props} />
}

export {WebResourceInputsEditor}
