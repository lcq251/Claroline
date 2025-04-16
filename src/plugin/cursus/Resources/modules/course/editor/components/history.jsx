import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {LogOperationalList} from '#/main/log/components/operational-list'
import {selectors} from '#/plugin/cursus/course/store'

const CourseEditorHistory = () => {
  const courseId = useSelector(selectors.id)

  return (
    <EditorPage
      title={trans('history')}
      help={trans('course_history_desc', {}, 'cursus')}
    >
      <LogOperationalList
        autoload={!!courseId}
        url={['apiv2_logs_operational_object', {objectName: 'Claroline/CursusBundle/Entity/Course', objectId: courseId}]}
      />
    </EditorPage>
  )
}


export {
  CourseEditorHistory
}
