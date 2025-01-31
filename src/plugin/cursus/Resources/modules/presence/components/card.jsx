import React from 'react'
import get from 'lodash/get'
import classes from 'classnames'
import {PropTypes as T} from 'prop-types'

import {DataCard} from '#/main/app/data/components/card'

import {constants} from '#/plugin/cursus/constants'
import {displayUsername} from '#/main/community/utils'
import {User as UserTypes} from '#/main/community/prop-types'

const PresenceCard = props =>
  <DataCard
    {...props}
    poster={get(props.data, 'user.picture')}
    name={displayUsername(props.data.user)}
    title={displayUsername(props.data.user)}
    subtitle={
      <div
        className={classes('badge', `text-bg-${constants.PRESENCE_STATUS_COLORS[props.data.status]}`)}>
        {constants.PRESENCE_STATUSES[props.data.status]}
      </div>
    }
    contentText={get(props.data.user, 'meta.description')}
    asIcon={true}
  />

PresenceCard.propTypes = {
  className: T.string,
  data: T.shape(
    UserTypes.propTypes
  ).isRequired
}

export {
  PresenceCard
}
