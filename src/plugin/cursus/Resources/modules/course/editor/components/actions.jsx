import React, {useMemo} from 'react'
import {useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {EditorActions} from '#/main/app/editor'
import {selectors as securitySelectors} from '#/main/app/security'
import {selectors as toolSelectors} from '#/main/core/tool'

import {getActions} from '#/plugin/cursus/course/utils'
import {actions, selectors} from '#/plugin/cursus/course/editor/store'

const CourseEditorActions = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const currentUser = useSelector(securitySelectors.currentUser)
  const toolPath = useSelector(toolSelectors.path)

  const course = useSelector(selectors.course)

  const refresher = {
    add: () => true,
    update: (courses) => {
      // checks if the action has modified the current node
      const currentCourse = courses.find(c => c.id === course.id)
      if (currentCourse) {
        dispatch(actions.reset(currentCourse))
      }
    },
    delete: (courses) => {
      // checks if the action has deleted the current node
      const currentCourse = courses.find(c => c.id === course.id)
      if (currentCourse) {
        history.push(toolPath)
      }
    }
  }

  const courseActions = useMemo(() => {
    if (!isEmpty(course)) {
      return getActions([course], refresher, toolPath, currentUser)
    }

    return []
  }, [course])

  return (
    <EditorActions
      actions={courseActions}
    />
  )
}

export {
  CourseEditorActions
}
