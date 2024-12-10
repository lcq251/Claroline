import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {TooltipOverlay} from '#/main/app/overlays/tooltip/components/overlay'

const FormStatus = props =>
  <TooltipOverlay
    id={props.id}
    tip={trans('form_validating_desc')}
    position={props.tooltip || 'bottom'}
  >
    <span className={classes(props.className, 'validation-status fa fa-exclamation-circle text-danger')} />
  </TooltipOverlay>

FormStatus.propTypes = {
  className: T.string,
  id: T.string.isRequired,
  tooltip: T.oneOf(['left', 'top', 'right', 'bottom']),
}

export {
  FormStatus
}
