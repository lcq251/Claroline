import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'

import {EditorPage} from '#/main/app/editor'
import {selectors} from '#/plugin/cursus/course/store'
import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {SessionList} from '#/plugin/cursus/session/components/list'
import {hasPermission} from '#/main/app/security'
import {SessionDateCard} from '#/plugin/cursus/session/components/card'

const CourseEditorCanceledSessions = (props) =>
  <EditorPage
    title={trans('canceled_sessions', {}, 'cursus')}
    help={trans('canceled_sessions_help', {}, 'cursus')}
  >
    <SessionList
      path={props.path}
      course={props.course}
      name={selectors.STORE_NAME+'.courseSessionsCanceled'}
      url={['apiv2_cursus_session_list_canceled', {id: props.course.id}]}
      delete={{
        url: ['apiv2_cursus_session_delete'],
        displayed: (rows) => -1 !== rows.findIndex(row => hasPermission('delete', row))
      }}
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
