import React, {useId} from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import classes from 'classnames'

const FormSave = (props) => {
  if (props.pendingChanges) {
    const descriptionId = useId()

    const saveEnabled = !props.disabled && !props.errors

    return (
      <div
        className="form-pending-changes sticky-bottom d-flex align-items-center mt-auto py-2 px-3 gap-1"
        role="toolbar"
        aria-label={trans('form_toolbar')}
        aria-describedby={descriptionId}
      >
        <span className="flex-fill" id={descriptionId}>
          {trans(props.errors ? 'form_errors' : 'form_pending_changes')}
        </span>

        {!props.errors &&
          <Button
            {...props.save}
            className="btn btn-link flex-shrink-0"
            label={trans('save', {}, 'actions')}
            type={CALLBACK_BUTTON}
            size="sm"
            data-bs-theme="dark"
            disabled={!saveEnabled}
          />
        }

        {!props.errors &&
          <Button
            {...props.save}
            className={classes('btn btn-primary flex-shrink-0', {
              'btn-wave': saveEnabled
            })}
            label={trans('save_and_close', {}, 'actions')}
            size="sm"
            htmlType="submit"
            disabled={!saveEnabled}
          />
        }
      </div>
    )
  }

  return null
}

FormSave.propTypes = {
  errors: T.bool,
  pendingChanges: T.bool.isRequired,
  save: T.shape({

  })
}

FormSave.defaultProps = {
  errors: false
}

export {
  FormSave
}
