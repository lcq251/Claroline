import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {User as UserTypes} from '#/main/community/prop-types'
import {MODAL_USERS} from '#/main/community/modals/users'
import {DataMicro} from '#/main/app/data/components/micro'

const UserInput = (props) =>
  <EntityInput
    {...props}
    add={trans(props.multiple ? 'add_users' : 'add_user', {}, 'actions')}
    pickerType={MODAL_USERS}
    card={(cardProps) => <DataMicro {...cardProps} object={{thumbnail: cardProps.object.picture, name: cardProps.object.name}} />}
  />

implementPropTypes(UserInput, EntityInput, {
  value: T.oneOfType([
    T.shape(
      UserTypes.propTypes
    ),
    T.arrayOf(T.shape(
      UserTypes.propTypes
    ))
  ])
})

export {
  UserInput
}
