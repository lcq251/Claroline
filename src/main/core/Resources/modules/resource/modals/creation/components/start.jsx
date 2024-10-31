import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ResourceCreation} from '#/main/core/resource/components/creation'

const CreationStart = props =>
  <div className="modal-body" role="presentation">
    <ResourceCreation
      contextId={props.contextId}
      changeStep={props.changeStep}
      startCreation={props.startCreation}
    />
  </div>

CreationStart.propTypes = {
  contextId: T.string,
  changeStep: T.func.isRequired,
  startCreation: T.func.isRequired
}

export {
  CreationStart
}
