import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Modal} from '#/main/app/overlays/modal/components/modal'

import {Privacy} from '#/main/privacy/components/privacy'

const PrivacyModal = (props) =>
  <Modal
    {...props}
    title={trans('privacy_policy',{},'privacy')}
    size="lg"
  >
    <div className="modal-body" role="presentation">
      <Privacy />
    </div>
  </Modal>

PrivacyModal.propTypes = {
  // from modal
  fadeModal: T.func.isRequired
}

export {
  PrivacyModal
}
