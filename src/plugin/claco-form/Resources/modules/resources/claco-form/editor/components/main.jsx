import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ResourceEditor} from '#/main/core/resource'

import {selectors} from '#/plugin/claco-form/resources/claco-form/store'

import {EditorCategories} from '#/plugin/claco-form/resources/claco-form/editor/components/categories'
import {EditorList} from '#/plugin/claco-form/resources/claco-form/editor/components/list'
import {ClacoFormEditorActions} from '#/plugin/claco-form/resources/claco-form/editor/components/actions'
import {ClacoFormEditorEntries} from '#/plugin/claco-form/resources/claco-form/editor/components/entries'
import {ClacoFormEditorAppearance} from '#/plugin/claco-form/resources/claco-form/editor/components/appearance'
import {ClacoFormEditorPermissions} from '#/plugin/claco-form/resources/claco-form/editor/components/permissions'

const ClacoFormEditor = () => {
  const clacoForm = useSelector(selectors.clacoForm)
  const categories = useSelector(selectors.categories)

  return (
    <ResourceEditor
      additionalData={() => ({
        resource: clacoForm,
        categories: categories
      })}
      appearancePage={ClacoFormEditorAppearance}
      permissionsPage={ClacoFormEditorPermissions}
      actionsPage={ClacoFormEditorActions}
      pages={[
        {
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

export {
  ClacoFormEditor
}
