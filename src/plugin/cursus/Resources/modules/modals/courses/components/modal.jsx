import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {param} from '#/main/app/config'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'

import {CourseCard} from '#/plugin/cursus/course/components/card'

const CoursesModal = (props) =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-graduation-cap"
    name="trainingCoursesPicker"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true
      }, {
        name: 'code',
        type: 'string',
        label: trans('code')
      }, {
        name: 'location',
        type: 'location',
        label: trans('location'),
        displayable: false,
        sortable: false
      }, {
        name: 'meta.duration',
        alias: 'duration',
        type: 'number',
        label: trans('duration'),
        displayed: true,
        filterable: false,
        options: {unit: trans('hours')}
      }, {
        name: 'pricing.price',
        alias: 'price',
        label: trans('price'),
        type: 'currency',
        displayable: param('pricing.enabled'),
        displayed: param('pricing.enabled'),
        filterable: param('pricing.enabled'),
        sortable: param('pricing.enabled')
      }, {
        name: 'tags',
        type: 'tag',
        label: trans('tags'),
        sortable: false,
        options: {
          objectClass: 'Claroline\\CursusBundle\\Entity\\Course'
        }
      }
    ]}
    card={CourseCard}
  />

CoursesModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool,
  // from modal
  fadeModal: T.func.isRequired
}

CoursesModal.defaultProps = {
  url: ['apiv2_cursus_course_list'],
  title: trans('courses', {}, 'cursus')
}

export {
  CoursesModal
}
