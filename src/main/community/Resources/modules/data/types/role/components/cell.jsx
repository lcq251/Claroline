import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {Badge} from '#/main/app/components/badge'

import {Role as RoleTypes} from '#/main/community/role/prop-types'

const RoleCell = (props) => {
  console.log(props.multiple)
  if (isEmpty(props.data)) {
    return '-'
  }

  if (!props.multiple) {
    return (
      <Badge key={props.data.name} subtle={true} variant="primary">{trans(props.data.translationKey)}</Badge>
    )
  }

  return (
    <div className="d-flex flex-row gap-1" role="presentation">
      {props.data.map(role => 
        <Badge key={role.name} subtle={true} variant="primary">{trans(role.translationKey)}</Badge>
      )}
    </div>
  )
}

RoleCell.propTypes = {
  multiple: T.bool,
  data: T.oneOfType([
    T.shape(
      RoleTypes.propTypes
    ),
    T.arrayOf(T.shape(
      RoleTypes.propTypes
    ))
  ])
}

export {
  RoleCell
}
