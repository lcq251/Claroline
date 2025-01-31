import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {DataCard} from '#/main/app/data/components/card'

import {User as UserTypes} from '#/main/community/prop-types'
import {UserStatus} from '#/main/app/user/components/status'

const UserCard = props =>
  <DataCard
    poster={get(props.data, 'picture')}
    icon="fa fa-user"
    name={props.data.name}
    title={props.data.name}
    meta={
      <UserStatus user={props.data} variant="badge" />
    }
    contentText={get(props.data, 'meta.description')}
    asIcon={true}
    {...props}
  />

UserCard.propTypes = {
  size: T.string,
  orientation: T.string,
  className: T.string,
  data: T.shape(
    UserTypes.propTypes
  ).isRequired
}

export {
  UserCard
}
