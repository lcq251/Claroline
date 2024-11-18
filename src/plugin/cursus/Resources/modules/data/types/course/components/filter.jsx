import React from 'react'

import {EntityFilter} from '#/main/app/data/types/entity'

import {MODAL_TRAINING_COURSES} from '#/plugin/cursus/modals/courses'

const CourseFilter = (props) =>
  <EntityFilter
    {...props}
    icon="fa fa-graduation-cap"
    pickerType={MODAL_TRAINING_COURSES}
  />

CourseFilter.propTypes = EntityFilter.propTypes

export {
  CourseFilter
}
