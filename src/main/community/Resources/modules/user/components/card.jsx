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
    name={get(props.data, 'name')}
    title={get(props.data, 'name')}
    meta={
      <UserStatus user={props.data} variant="badge" />
    }
    contentText={get(props.data, 'meta.description')}
    asIcon={true}
    {...props}
  />

UserCard.propTypes = {
  data: T.shape(
    UserTypes.propTypes
  ).isRequired
}

export {
  UserCard
}
