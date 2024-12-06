import React, {useState, useId} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ContentMessage} from '#/main/app/content/components/message'

import {User as UserTypes} from '#/main/community/prop-types'
import {DataInput} from '#/main/app/data/components/input'

const UserMessageForm = (props) => {
  const [pendingChanges, setPendingChanges] = useState(false)
  const [content, setContent] = useState(props.content)
  const inputId = useId()

  return (
    <ContentMessage
      className={classes('user-message-form-container', props.className)}
      user={props.user}
      date={props.date}
      position={props.position}
    >
      <DataInput
        id={inputId}
        type={props.allowHtml ? 'html' : 'string'}
        label={trans('message')}
        value={content}
        required={true}
        options={{long: true}}
        autoFocus={true}
        hideLabel={true}
        onChange={(updated) => {
          setContent(updated)
          setPendingChanges(true)
        }}
      />

      <div className="d-flex align-items-center justify-content-end gap-1" role="presentation">
        {props.cancel &&
          <Button
            type={CALLBACK_BUTTON}
            className="btn btn-body"
            label={trans('cancel', {}, 'actions')}
            callback={props.cancel}
            primary={true}
          />
        }

        <Button
          type={CALLBACK_BUTTON}
          className="btn btn-primary"
          disabled={!pendingChanges || !content}
          label={props.submitLabel}
          callback={() => {
            props.submit(content)
            setContent('')
            setPendingChanges(true)
          }}
        />
      </div>
    </ContentMessage>
  )
}

UserMessageForm.propTypes = {
  className: T.string,

  /**
   * The user who have sent the message.
   *
   * @type {object}
   */
  user: T.shape(UserTypes.propTypes),

  /**
   * The date of the message.
   *
   * @type {string}
   */
  date: T.string,

  /**
   * The content of the message.
   *
   * @type {string}
   */
  content: T.string,

  /**
   * Allow (or not) HTML in message content.
   *
   * @type {bool}
   */
  allowHtml: T.bool,

  /**
   * The position of the User avatar.
   *
   * @type {string}
   */
  position: T.oneOf(['left', 'right']),

  submitLabel: T.string,
  submit: T.func.isRequired,
  cancel: T.func
}

UserMessageForm.defaultProps = {
  className: '',
  user: {},
  content: '',
  allowHtml: false,
  position: 'left',
  submitLabel: trans('create', {}, 'actions')
}

export {
  UserMessageForm
}
