import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {User as UserTypes} from '#/main/community/prop-types'
import {Html} from '#/main/app/components/html'
import {ContentMessage} from '#/main/app/content/components/message'

const UserMessage = ({className, user, date, content, position = 'left', actions = []}) =>
  <ContentMessage
    className={className}
    user={user}
    date={date}
    position={position}
    actions={actions}
  >
    <Html>{content}</Html>
  </ContentMessage>

UserMessage.propTypes = {
  className: T.string,

  /**
   * The date of the message.
   *
   * @type {string}
   */
  date: T.string,

  /**
   * The user who has sent the message.
   *
   * @type {object}
   */
  user: T.shape(UserTypes.propTypes),

  /**
   * The object of the message.
   *
   * @type {string}
   */
  object: T.string,

  /**
   * The content of the message.
   *
   * @type {string}
   */
  content: T.string.isRequired,

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

  /**
   * The available actions for the message.
   *
   * @type {array}
   */
  actions: T.arrayOf(
    T.shape(merge({}, ActionTypes.propTypes, {
      displayed: T.bool.isRequired
    }))
  )
}

export {
  UserMessage
}
