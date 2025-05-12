import React from 'react'
import classes from 'classnames'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Alert as AlertTypes} from '#/main/app/overlays/alert/prop-types'
import {Expire} from '#/main/app/components/expire'

import {constants} from '#/main/app/overlays/alert/constants'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

const FlyingAlertContent = props => {
  const status = constants.ALERT_STATUS[props.status]

  let role = 'status'
  if ([
    constants.ALERT_STATUS_WARNING,
    constants.ALERT_STATUS_ERROR,
    constants.ALERT_STATUS_UNAUTHORIZED,
    constants.ALERT_STATUS_FORBIDDEN
  ].includes(props.status)) {
    role = 'alert'
  }

  return (
    <li
      className={classes('flying-alert d-flex flex-row align-items-baseline gap-3 rounded-2 bg-body w-100', `border border-${status.variant}`, status.removable && 'cursor-pointer')}
      role={role}
      onClick={() => {
        if (status.removable) {
          props.removeAlert(props.id)
        }
      }}
    >
      <span className={classes('flying-alert-icon fa fa-fw fs-lg flex-shrink-0', `text-${status.variant}`, status.icon)} aria-hidden={true} />

      <span className="flex-fill text-body-secondary fs-sm" role="presentation">
        <b className="d-block text-body fs-base mb-1">
          {props.title}
        </b>

        {props.message}
      </span>
      {status.removable &&
        <Button
          className="btn btn-text-body m-n2"
          type={CALLBACK_BUTTON}
          icon="fa fa-times"
          label={trans('close', {}, 'actions')}
          callback={() => props.removeAlert(props.id)}
          //size="sm"
          tooltip="bottom"
        />
      }
    </li>
  )
}

implementPropTypes(FlyingAlertContent, AlertTypes, {
  removeAlert: T.func.isRequired
})

const Alert = props => {
  const status = constants.ALERT_STATUS[props.status]

  if (status.timeout) {
    return (
      <Expire
        delay={status.timeout}
        onExpire={() => props.removeAlert(props.id)}
      >
        <FlyingAlertContent {...props} />
      </Expire>
    )
  }

  return (
    <FlyingAlertContent {...props} />
  )
}

implementPropTypes(Alert, AlertTypes, {
  removeAlert: T.func.isRequired
})

export {
  Alert
}
