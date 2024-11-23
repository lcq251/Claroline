import React from 'react'
import {PropTypes as T} from 'prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'

import {User as UserTypes} from '#/main/community/prop-types'
import {DataMicro} from '#/main/app/data/components/micro'

const UserCell = props =>
  <EntityCell
    {...props}
    card={(cardProps) => <DataMicro {...cardProps} object={{thumbnail: cardProps.object.picture, name: cardProps.object.name}} />}
  />

UserCell.propTypes = {
  data: T.oneOfType([
    T.shape(
      UserTypes.propTypes
    ),
    T.arrayOf(T.shape(
      UserTypes.propTypes
    ))
  ])
}

export {
  UserCell
}
