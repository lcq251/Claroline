import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {Datetime} from '#/main/app/components/date'
import {LinkButton} from '#/main/app/buttons'
import {UserAvatar} from '#/main/app/user/components/avatar'
import {UserMicro} from '#/main/core/user/components/micro'
import {ThumbnailSkeleton} from '#/main/app/components/thumbnail'

const ContentPublicationSkeleton = ({
  className
}) =>
  <div className={classes('text-body-tertiary d-flex align-items-center gap-3', className)} role="presentation">
    <ThumbnailSkeleton
      size="xs"
      square={true}
    />

    <span className="placeholder rounded-1 w-25" role="presentation" />
  </div>

ContentPublicationSkeleton.propTypes = {
  className: T.string
}

const ContentPublication = ({
  className,
  user = {},
  publishedAt = null,
  condensed = true
}) => {
  if (condensed) {
    return (
      <div className={classes('text-body-tertiary d-flex align-items-center gap-3', className)} role="presentation">
        <UserMicro
          {...(user || {})}
          link={true}
        />

        <span>-</span>

        {publishedAt &&
          <Datetime value={publishedAt} long={true} />
        }
      </div>
    )
  }

  return (
    <div className={classes('d-flex flex-row gap-3', className)} role="presentation">
      <UserAvatar
        user={user}
        size="sm"
      />
      <div className="d-flex flex-column" role="presentation">
        <LinkButton className="fw-normal text-reset" target="#">{get(user, 'name') || trans('unknown')}</LinkButton>
        <span className="text-body-tertiary">
        {trans('Publié le ')}
          <Datetime value={publishedAt} long={true} time={true} />
      </span>
      </div>
    </div>
  )
}

ContentPublication.propTypes = {
  className: T.string,
  user: T.object,
  publishedAt: T.string,
  condensed: T.bool
}

export {
  ContentPublication,
  ContentPublicationSkeleton
}
