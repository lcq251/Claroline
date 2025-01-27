import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {ModalEmpty} from '#/main/app/overlays/modal/components/empty'
import {CallbackButton} from '#/main/app/buttons'

const FullscreenModal = props =>
  <ModalEmpty
    {...omit(props, 'url', 'alt')}
    animation={false}
    dialogAs="div"
    className="h-100 w-100 d-flex"
  >
    <CallbackButton
      className="focus-ring flex-fill"
      callback={props.fadeModal}
    >
      <img
        className="img-fluid mh-100 m-auto p-1"
        src={props.url}
        alt={props.alt}
        onContextMenu={(e)=> {
          e.preventDefault()
        }}
      />
    </CallbackButton>
  </ModalEmpty>

FullscreenModal.propTypes = {
  url: T.string.isRequired,
  alt: T.string.isRequired
}

export {
  FullscreenModal
}
