import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Modal} from '#/main/app/overlays/modal/components/modal'

import {ResourceInputsEditor} from '#/integration/mindme-ai/resource/inputs'

/**
 * Modal configuring the resources linked as inputs of the web resource.
 * It reuses the generic ResourceInputsEditor (load, multi-select, order,
 * delete and save via PUT on the ResourceReference API).
 */
const InputsModal = (props) =>
  <Modal
    {...omit(props, 'hostId')}
    title={trans('link_resources', {}, 'resource')}
  >
    <div className="modal-body">
      <ResourceInputsEditor hostId={props.hostId} />
    </div>
  </Modal>

InputsModal.propTypes = {
  hostId: T.string.isRequired,

  // from modal container
  fadeModal: T.func.isRequired
}

export {
  InputsModal
}
