import React from 'react'
import {PropTypes as T} from 'prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'

import {Organization as OrganizationTypes} from '#/main/community/organization/prop-types'

const TeamCell = props =>
  <EntityCell
    {...props}
  />

TeamCell.propTypes = {
  data: T.oneOfType([
    T.shape(
      OrganizationTypes.propTypes
    ),
    T.arrayOf(T.shape(
      OrganizationTypes.propTypes
    ))
  ])
}

export {
  TeamCell
}
