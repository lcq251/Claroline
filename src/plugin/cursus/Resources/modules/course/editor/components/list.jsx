import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {SessionList} from '#/plugin/cursus/session/components/list'
import {SessionDateCard} from '#/plugin/cursus/session/components/card'
import {selectors} from '#/plugin/cursus/course/editor/store'

const CourseEditorCanceledSessions = (props) =>
  <EditorPage
    title={trans('canceled_sessions', {}, 'cursus')}
    help={trans('canceled_sessions_help', {}, 'cursus')}
  >
    <SessionList
      path={props.path}
      name={selectors.STORE_NAME+'.canceledSessions'}
      url={['apiv2_cursus_session_list_canceled', {id: props.course.id}]}
      card={SessionDateCard}
    />
  </EditorPage>

CourseEditorCanceledSessions.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired
}

export {
  CourseEditorCanceledSessions
}
