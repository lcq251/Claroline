import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'

const CourseDisplay = (props) =>
  <EntityDisplay
    placeholder={trans('no_course', {}, 'cursus')}
    {...props}
  />

CourseDisplay.propTypes = {
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
  CourseDisplay
}
