import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {MODAL_TRAINING_COURSES} from '#/plugin/cursus/modals/courses'
import {trans} from '#/main/app/intl'

const CourseInput = props =>
  <EntityInput
    {...props}
    pickerType={MODAL_TRAINING_COURSES}
    add={trans(props.multiple ? 'add_courses' : 'add_course', {}, 'actions')}
  />

implementPropTypes(CourseInput, EntityInput.propTypes, {
  value: T.oneOfType([
    T.shape(
      CourseTypes.propTypes
    ),
    T.arrayOf(T.shape(
      CourseTypes.propTypes
    ))
  ])
})

export {
  CourseInput
}
