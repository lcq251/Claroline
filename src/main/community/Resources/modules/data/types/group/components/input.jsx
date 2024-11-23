import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

import {Group as GroupTypes} from '#/main/community/prop-types'
import {MODAL_GROUPS} from '#/main/community/modals/groups'
import {EntityInput} from '#/main/app/data/types/entity'

const GroupInput = props =>
  <EntityInput
    {...props}
    placeholder={trans('no_group', {}, 'community')}
    add={trans(props.multiple ? 'add_groups' : 'add_group', {}, 'actions')}
    pickerType={MODAL_GROUPS}
  />

implementPropTypes(GroupInput, EntityInput, {
  value: T.arrayOf(T.shape(
    GroupTypes.propTypes
  ))
})

export {
  GroupInput
}
