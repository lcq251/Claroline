import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor} from '#/main/core/resource'

import {selectors} from '#/plugin/lesson/resources/lesson/store'
import {LessonEditorContent} from '#/plugin/lesson/resources/lesson/editor/components/content'
import {LessonEditorAppearance} from '#/plugin/lesson/resources/lesson/editor/components/appearance'

const LessonEditor = () => {
  const lesson = useSelector(selectors.lesson)
  const chapters = useSelector(selectors.treeData)

  return (
    <ResourceEditor
      additionalData={() => ({
        resource: lesson,
        chapters: chapters.children || []
      })}
      appearancePage={LessonEditorAppearance}
      pages={[
        {
          name: 'content',
          title: trans('pages'),
          help: trans('Gérez les différentes pages de votre Connaissance.'),
          component: LessonEditorContent,
          displayed: false
        }
      ]}
    />
  )
}

export {
  LessonEditor
}
