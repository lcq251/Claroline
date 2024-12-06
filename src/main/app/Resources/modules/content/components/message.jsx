import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl/translation'
import {displayDate} from '#/main/app/intl/date'
import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {User as UserTypes} from '#/main/community/prop-types'

import {LinkButton} from '#/main/app/buttons/link/components/button'

import {route} from '#/main/community/user/routing'
import {UserAvatar} from '#/main/app/user/components/avatar'
import {displayUsername} from '#/main/community/utils'
import {Datetime} from '#/main/app/components/date'

/**
 * Representation of a User message.
 * Can be used in comments, messages, etc.
 */
const ContentMessage = props => {
  let SenderComponent
  if (props.user) {
    SenderComponent = (
      <LinkButton target={route(props.user)} className="user-message-sender focus-ring">
        <UserAvatar user={props.user} size="sm" />
      </LinkButton>
    )
  } else {
    SenderComponent = (
      <span className="user-message-sender">
        <UserAvatar size="sm" />
      </span>
    )
  }

  return (
    <article className={classes('user-message-container', props.className, {
      'user-message-left': 'left' === props.position,
      'user-message-right': 'right' === props.position
    })}>
      {SenderComponent}

      <div className="user-message p-3" role="presentation">
        <div className="user-message-meta fs-sm mb-3 d-flex flex-row gap-2 align-items-center" role="presentation">
          {props.user ?
            <LinkButton target={route(props.user)} className="text-reset fw-bold">
              {displayUsername(props.user)}
            </LinkButton> :
            <span className="fw-bold" role="presentation">
              {displayUsername()}
            </span>
          }

          {props.date &&
            <>
              <span className="text-body-secondary" role="presentation">-</span>
              <Datetime value={props.date} long={true} time={true} className="text-body-secondary" />
            </>
          }

          {0 !== props.actions.length &&
            <Toolbar
              className="user-message-actions btn-toolbar ms-auto"
              buttonName="btn btn-text-body p-0"
              tooltip="bottom"
              toolbar="more"
              actions={props.actions}
            />
          }
        </div>

        {props.children}
      </div>
    </article>
  )
}

ContentMessage.propTypes = {
  className: T.string,

  /**
   * The date of the message.
   *
   * @type {string}
   */
  date: T.string,

  /**
   * The user who have sent the message.
   *
   * @type {object}
   */
  user: T.shape(UserTypes.propTypes),

  /**
   * The content to display.
   *
   * @type {string}
   */
  children: T.node.isRequired,

  /**
   * The position of the User avatar.
   *
   * @type {string}
   */
  position: T.oneOf(['left', 'right']),

  /**
   * The available actions for the message.
   *
   * @type {array}
   */
  actions: T.arrayOf(
    T.shape(merge({}, ActionTypes.propTypes, {
      displayed: T.bool
    }))
  )
}

ContentMessage.defaultProps = {
  position: 'left',
  actions: []
}

export {
  ContentMessage
}
