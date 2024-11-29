import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {DataMicro} from '#/main/app/data/components/micro'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {MODAL_ROLES} from '#/main/community/modals/roles'
import {Role as RoleTypes} from '#/main/community/role/prop-types'

const RoleInput = (props) =>
  <EntityInput
    {...props}
    add={trans(props.multiple ? 'add_roles' : 'add_role', {}, 'actions')}
    pickerType={MODAL_ROLES}
    card={(cardProps) => <DataMicro {...cardProps} object={{name: trans(cardProps.object.translationKey)}} />}
  />

implementPropTypes(RoleInput, DataInputTypes, {
  value: T.oneOfType([
    T.shape(
      RoleTypes.propTypes
    ),
    T.arrayOf(T.shape(
      RoleTypes.propTypes
    ))
  ])
})

export {
  RoleInput
}
