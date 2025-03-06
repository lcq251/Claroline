import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ResourceEditor} from '#/main/core/resource'

import {selectors} from '#/plugin/claco-form/resources/claco-form/store'

import {EditorParameters} from '#/plugin/claco-form/resources/claco-form/editor/components/parameters'
import {EditorCategories} from '#/plugin/claco-form/resources/claco-form/editor/components/categories'
import {EditorComments} from '#/plugin/claco-form/resources/claco-form/editor/components/comments'
import {EditorKeywords} from '#/plugin/claco-form/resources/claco-form/editor/components/keywords'
import {EditorList} from '#/plugin/claco-form/resources/claco-form/editor/components/list'
import {ClacoFormEditorActions} from '#/plugin/claco-form/resources/claco-form/editor/components/actions'
import {ClacoFormEditorEntries} from '#/plugin/claco-form/resources/claco-form/editor/components/entries'
import {ClacoFormEditorAppearance} from '#/plugin/claco-form/resources/claco-form/editor/components/appearance'

const ClacoFormEditor = (props) => {
  const clacoForm = useSelector(selectors.clacoForm)
  const categories = useSelector(selectors.categories)
  const keywords = useSelector(selectors.keywords)

  return (
    <ResourceEditor
      additionalData={() => ({
        resource: clacoForm,
        categories: categories,
        keywords: keywords
      })}
      appearancePage={ClacoFormEditorAppearance}
      actionsPage={ClacoFormEditorActions}
      pages={[
        {
          name: 'parameters',
          icon: 'fa fa-fw fa-cog',
          title: trans('parameters'),
          render: () => (
            <EditorParameters
              validateTemplate={props.validateTemplate}
            />
          )
        }, {
          name: 'entries',
          icon: 'fa fa-fw fa-file',
          title: trans('entries', {}, 'clacoform'),
          component: ClacoFormEditorEntries
        }, {
          name: 'list',
          icon: 'fa fa-fw fa-list',
          title: trans('entries_list', {}, 'clacoform'),
          component: EditorList
        }, {
          name: 'categories',
          icon: 'fa fa-fw fa-object-group',
          title: trans('categories'),
          component: EditorCategories
        }
      ]}
    />
  )
}

ClacoFormEditor.propTypes = {
  validateTemplate: T.func.isRequired
}

export {
  ClacoFormEditor
}
