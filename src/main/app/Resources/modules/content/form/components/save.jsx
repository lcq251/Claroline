import React, {useId} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const FormSave = (props) => {
  if (props.pendingChanges) {
    const descriptionId = useId()

    const saveEnabled = !props.disabled && !props.errors

    return (
      <div
        className={classes('form-pending-changes sticky-bottom d-flex align-items-center mt-auto py-2 px-3 mx-n3 gap-1', {
          'text-bg-danger': props.errors,
          'text-bg-dark': !props.errors
        })}
        role="toolbar"
        aria-label={trans('form_toolbar')}
        aria-describedby={descriptionId}
      >
        <span className="flex-fill py-1 d-inline-block" id={descriptionId}>
          {props.errors &&
            <span className="fa fa-circle-exclamation icon-with-text-right" aria-hidden={true} />
          }
          {trans(props.errors ? 'form_errors' : 'form_pending_changes')}
        </span>

        {!props.errors &&
          <Button
            {...props.save}
            className="btn btn-link flex-shrink-0 px-3"
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
            className={classes('btn btn-primary flex-shrink-0 px-3', {
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

  }),
  close: T.string
}

FormSave.defaultProps = {
  errors: false
}

export {
  FormSave
}
