import React from 'react'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ContentSummary} from '#/main/app/content/components/summary'

import {ToolEditorOverview, selectors as editorSelectors} from '#/main/core/tool/editor'

import {getTabSummary} from '#/plugin/home/tools/home/utils'
import {selectors} from '#/plugin/home/tools/home/editor/store'
import {MODAL_HOME_CREATION} from '#/plugin/home/tools/home/editor/modals/creation'
import {useHistory} from 'react-router-dom'

const HomeEditorOverview = (props) => {
  const history = useHistory()
  const editorPath = useSelector(editorSelectors.path)

  const editedTabs = useSelector(selectors.editorTabs)

  return (
    <ToolEditorOverview>
      <ContentSummary
        links={editedTabs.map((tab) => getTabSummary(editorPath, tab, true))}
        noCollapse={true}
      />

      <Button
        type={MODAL_BUTTON}
        className={classes('btn btn-primary w-100 mt-3', {
          'btn-wave': isEmpty(editedTabs)
        })}
        label={trans('add_tab', {}, 'home')}
        size="lg"
        modal={[MODAL_HOME_CREATION, {
          position: editedTabs.length,
          create: (tab) => props.createTab(null, tab, (slug) => history.push(`${editorPath}/${slug}`))
        }]}
      />
    </ToolEditorOverview>
  )
}

export {
  HomeEditorOverview
}
