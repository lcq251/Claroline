import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {CourseCard} from '#/plugin/cursus/course/components/card'
import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {MODAL_TRAINING_COURSES} from '#/plugin/cursus/modals/courses'

const CourseInput = props =>
  <EntityInput
    {...props}
    placeholder={trans('no_course', {}, 'cursus')}
    card={CourseCard}
    pickerType={MODAL_TRAINING_COURSES}
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
