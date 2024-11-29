import React from 'react'
import {PropTypes as T} from 'prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'

const CourseCell = props =>
  <EntityCell
    {...props}
  />

CourseCell.propTypes = {
  data: T.oneOfType([
    T.shape(
      CourseTypes.propTypes
    ),
    T.arrayOf(T.shape(
      CourseTypes.propTypes
    ))
  ])
}

export {
  CourseCell
}
