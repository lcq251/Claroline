import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {UserStatus} from '#/main/app/user/components/status'

/**
 * Avatar of a User.
 */
const UserAvatar = ({
  className,
  user,
  size = 'md',
  noStatus = false,
  noStatusTooltip = false,
  border = false
}) =>
  <span className={classes('position-relative user-avatar', size && `user-avatar-${size}`, className)} role="presentation">
    <Thumbnail
      size={size}
      thumbnail={get(user, 'picture')}
      name={get(user, 'name') || trans('unknown')}
      square={true}
      border={border}
    />

    {get(user, 'status') && !noStatus &&
      <UserStatus
        className="position-absolute top-100 start-100 translate-middle"
        user={user}
        variant={classes({
          tooltip: !noStatusTooltip,
          bullet: noStatusTooltip
        })}
      />
    }
  </span>

UserAvatar.propTypes = {
  className: T.string,
  user: T.shape({
    picture: T.string,
    name: T.string.isRequired,
    status: T.string,
    lastActivity: T.string
  }),
  size: T.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  noStatus: T.bool,
  noStatusTooltip: T.bool
}

export {
  UserAvatar
}
