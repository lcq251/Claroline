import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {useCurrentUser} from '#/main/app/security'

import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'
import {UserMessage} from '#/main/core/user/message/components/user-message'
import isEmpty from 'lodash/isEmpty'

const ForumMessages = (props) => {
  const currentUser = useCurrentUser()
  const [messageForm, setMessageForm] = useState(null)
  const [newForm, setNewForm] = useState(!!props.root)

  return (
    <>
      {!isEmpty(props.messages) &&
        <ul className="posts list-unstyled">
          {props.messages.map(message =>
            <li key={message.id} className={!!props.root ? 'mt-4' : 'mt-3'}>
              {messageForm === message.id ?
                <UserMessageForm
                  user={currentUser}
                  allowHtml={true}
                  submitLabel={trans('edit', {}, 'actions')}
                  date={message.meta.created}
                  content={message.content}
                  submit={(content) => {
                    props.updateMessage(message, content)
                    setMessageForm(null)
                  }}
                  cancel={() => setMessageForm(null)}
                /> :
                <UserMessage
                  user={get(message, 'meta.creator')}
                  date={message.meta.created}
                  content={message.content}
                  allowHtml={true}
                  actions={[
                    {
                      name: 'edit',
                      type: CALLBACK_BUTTON,
                      icon: 'fa fa-fw fa-pencil',
                      label: trans('edit', {}, 'actions'),
                      displayed: currentUser && (message.meta.creator.id === currentUser.id) && props.canReply,
                      callback: () => setMessageForm(message.id)
                    }, {
                      name: 'report',
                      type: CALLBACK_BUTTON,
                      icon: 'fa fa-fw fa-flag',
                      label: trans('flag', {}, 'forum'),
                      displayed: currentUser && (message.meta.creator.id !== currentUser.id) && !message.meta.flagged,
                      callback: () => props.reportMessage(message)
                    }, {
                      name: 'unreport',
                      type: CALLBACK_BUTTON,
                      icon: 'fa fa-fw fa-flag',
                      label: trans('unflag', {}, 'forum'),
                      displayed: currentUser && (message.meta.creator.id !== currentUser.id) && message.meta.flagged,
                      callback: () => props.unreportMessage(message)
                    }, {
                      name: 'delete',
                      type: CALLBACK_BUTTON,
                      icon: 'fa fa-fw fa-trash',
                      label: trans('delete', {}, 'actions'),
                      displayed:  currentUser && (message.meta.creator.id === currentUser.id || props.moderator),
                      callback: () => props.deleteMessage(message),
                      confirm: trans('remove_post_confirm_message', {}, 'forum'),
                      dangerous: true
                    }
                  ]}
                />
              }

              {!!props.root &&
                <div className="answer-comment-container mt-1" role="presentation">
                  <ForumMessages
                    root={false}
                    messages={message.children}
                    canReply={props.canReply}
                    addMessage={(child) => props.addMessage(child, message)}
                    updateMessage={props.updateMessage}
                    deleteMessage={props.deleteMessage}
                    reportMessage={props.reportMessage}
                    unreportMessage={props.unreportMessage}
                  />
                </div>
              }
            </li>
          )}
        </ul>
      }

      {(currentUser && props.canReply) &&
        <>
          {newForm ?
            <UserMessageForm
              className={!!props.root ? 'mt-4' : 'mt-2'}
              user={currentUser}
              allowHtml={true}
              submitLabel={trans('reply', {}, 'actions')}
              submit={(message) => {
                props.addMessage(message)
                if (!props.root) {
                  setNewForm(false)
                }
              }}
              cancel={!!props.root ? undefined : () => setNewForm(false)}
            /> :
            <Button
              className="btn btn-link btn-sm"
              type={CALLBACK_BUTTON}
              label={trans('reply', {}, 'actions')}
              callback={() => setNewForm(true)}
              size="sm"
            />
          }
        </>
      }
    </>
  )
}

ForumMessages.propTypes = {
  root: T.bool.isRequired,
  messages: T.arrayOf(T.shape({

  })),
  moderator: T.bool,
  canReply: T.bool,

  addMessage: T.func.isRequired,
  updateMessage: T.func.isRequired,
  deleteMessage: T.func.isRequired,
  reportMessage: T.func.isRequired,
  unreportMessage: T.func.isRequired
}

export {
  ForumMessages
}
