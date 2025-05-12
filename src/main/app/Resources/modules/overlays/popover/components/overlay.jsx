import React from 'react'
import {PropTypes as T} from 'prop-types'

import {OverlayTrigger} from '#/main/app/overlays/components/overlay'
import {Popover} from '#/main/app/overlays/popover/components/popover'

const PopoverOverlay = props => {
  if (!props.disabled) {
    return (
      <OverlayTrigger
        trigger="click"
        placement={props.position}
        rootClose={true}
        overlay={
          <Popover
            id={props.id}
            className={props.className}
          >
            {props.label &&
              <Popover.Header>
                {props.label}
              </Popover.Header>
            }
            <Popover.Body>
              {props.content}
            </Popover.Body>
          </Popover>
        }
      >
        {props.children}
      </OverlayTrigger>
    )
  }

  return props.children
}

PopoverOverlay.propTypes = {
  id: T.string.isRequired,
  disabled: T.bool,
  children: T.element.isRequired,
  className: T.string,
  label: T.node,
  content: T.node.isRequired,
  position: T.oneOf(['top', 'right', 'bottom', 'left'])
}

PopoverOverlay.defaultProps = {
  position: 'top',
  disabled: false
}

export {
  PopoverOverlay
}
