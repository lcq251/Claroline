import React from 'react'

import {ResourceEditor} from '#/main/core/resource/editor'
import {trans} from '#/main/app/intl/translation'
import {WebResourceInputsEditor} from '#/plugin/web-resource/resources/web-resource/pages/resource-inputs-editor'

/**
 * LinkResourcesEditor — a dedicated tab page for linking web resource inputs.
 * It displays the ResourceInputsEditor in a modal-like layout suitable for a page tab.
 */
const LinkResourcesEditor = (props) => {
  const hostId = props.hostId || ''
  return (
    <div className="link-resources-editor">
      <h3>{trans('link_resources', {}, 'resource')}</h3>
      <WebResourceInputsEditor hostId={hostId} />
    </div>
  )
}

export {LinkResourcesEditor}