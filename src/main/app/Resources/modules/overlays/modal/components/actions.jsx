import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Button} from '#/main/app/action'

const ModalActions = (props) => {
  return (
    <div className="modal-footer flex-sm-nowrap gap-2">
      {props.tertiaryAction &&
        <Button
          {...props.tertiaryAction}
          className={classes('btn btn-text-body me-auto', props.tertiaryAction.className)}
        />
      }

      {props.children}

      <div className="flex-nowrap d-flex gap-2">
        {props.secondaryAction && (undefined === props.secondaryAction.displayed || props.secondaryAction.displayed) &&
          <Button
            {...props.secondaryAction}
            className={classes('btn btn-link', props.secondaryAction.className)}
          />
        }

        {props.primaryAction && (undefined === props.primaryAction.displayed || props.primaryAction.displayed) &&
          <Button
            {...props.primaryAction}
            className={classes('btn btn-primary', props.primaryAction.className)}
          />
        }
      </div>
    </div>
  )
}

ModalActions.propTypes = {
  primaryAction: T.shape({

  }),
  secondaryAction: T.shape({

  }),
  tertiaryAction: T.shape({

  })
}

export {
  ModalActions
}
