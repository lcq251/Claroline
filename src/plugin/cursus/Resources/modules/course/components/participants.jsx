import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'

import {selectors} from '#/plugin/cursus/course/store'
import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {SessionUsers} from '#/plugin/cursus/session/components/users'

const CourseParticipants = (props) =>
  <SessionUsers
    path={props.path}
    className="mt-4"
    course={props.course}
    name={selectors.STORE_NAME+'.sessionUsers'}
    customDefinition={[
      {
        name: 'session',
        label: trans('session', {}, 'cursus'),
        type: 'training_session',
        displayed: true,
        displayable: true,
        filterable: true,
        options: {
          course: props.course,
          picker: {
            url: ['apiv2_cursus_course_list_sessions', {id: get(props.course, 'id')}],
            filters: [{property: 'status', value: 'not_ended'}]
          }
        }
      }
    ]}
  />

CourseParticipants.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired
}

export {
  CourseParticipants
}
