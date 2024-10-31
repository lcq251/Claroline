import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Modal} from '#/main/app/overlays/modal/components/modal'

import {TermsOfService} from '#/main/privacy/components/terms-of-service'
import {actions} from '#/main/privacy/modals/terms-of-service/actions'

const TermsOfServiceModal = props => {
  const dispatch = useDispatch()

  return (
    <Modal
      {...omit(props, 'validate', 'accept', 'onAccept', 'onRefuse')}
      title={trans('terms_of_service',{},'privacy')}
      size="lg"
      backdrop={props.validate ? 'static': undefined}
      closeButton={!props.validate}
    >
      <div className="modal-body" role="presentation">
        <TermsOfService />
      </div>

      {props.validate &&
        <div className="modal-footer">
          <Button
            type={CALLBACK_BUTTON}
            className="btn btn-primary"
            label={trans('terms_of_service_accept', {}, 'privacy')}
            callback={() => dispatch(actions.acceptTerms()).then(() => {
              props.onAccept()
              props.fadeModal()
            })}
          />
          <Button
            className="btn btn-danger"
            type={CALLBACK_BUTTON}
            label={trans('terms_of_service_refuse', {}, 'privacy')}
            dangerous={true}
            callback={() => {
              props.onRefuse()
              props.fadeModal()
            }}
          />
        </div>
      }
    </Modal>
  )
}

TermsOfServiceModal.propTypes = {
  validate: T.bool,
  accept: T.func.isRequired,
  onAccept: T.func,
  onRefuse: T.func,

  // from modal
  fadeModal: T.func.isRequired
}

TermsOfServiceModal.defaultProps = {
  validate: false,
  onAccept: () => true,
  onRefuse: () => true
}

export {
  TermsOfServiceModal
}
