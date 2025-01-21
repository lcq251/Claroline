import React, {useCallback} from 'react'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ContentSummary} from '#/main/app/content/components/summary'
import {EditorPage} from '#/main/app/editor'

import {selectors as editorSelectors} from '#/main/core/tool/editor'

import {actions, selectors} from '#/plugin/home/tools/home/editor/store'
import {MODAL_HOME_CREATION} from '#/plugin/home/tools/home/editor/modals/creation'
import {getFormDataPart} from '#/plugin/home/tools/home/editor/utils'
import {MODAL_HOME_POSITION} from '#/plugin/home/tools/home/editor/modals/position'
import {flattenTabs, getTabTitle} from '#/plugin/home/tools/home/utils'
import {MODAL_HOME_PARAMETERS} from '#/plugin/home/tools/home/editor/modals/parameters'

const HomeEditorSummary = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const editorPath = useSelector(editorSelectors.path)
  const contextData = useSelector(editorSelectors.contextData)
  const contextType = useSelector(editorSelectors.contextType)

  const createTab = useCallback((parent, tab) => {
    dispatch(actions.createTab(parent, tab))
    history.push(`${editorPath}/tabs/${tab.slug}`)
  }, [editorPath])

  const updateTab = useCallback((tabs, tabId, propValue, propPath = null) => {
    dispatch(actions.updateTab(tabs, tabId, propValue, propPath))
  }, [editorPath])

  const moveTab = useCallback((tabs, tabId, newPosition) => {
    dispatch(actions.moveTab(tabs, tabId, newPosition))
  }, [editorPath])

  const deleteTab = useCallback((tabs, currentTab) => {
    dispatch(actions.deleteTab(tabs, currentTab))
  }, [editorPath])

  const errors = useSelector(selectors.errors)
  const tabs = useSelector(selectors.tabs)

  function getTabSummary(tab, child = false) {
    return {
      type: LINK_BUTTON,
      icon: tab.icon ? `fa fa-fw fa-${tab.icon}` : undefined,
      label: tab.title,
      target: `${editorPath}/tabs/${tab.slug}`,
      subscript: !isEmpty(get(errors, getFormDataPart(tab.id, tabs))) ? {
        type: 'text',
        status: 'danger',
        value: <span className="fa fa-fw fa-exclamation-circle" role="alert" />
      } : undefined,
      additional: [
        {
          name: 'add-sub',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-plus',
          label: trans('tab_add_child', {}, 'home'),
          //displayed: !child, // only allow one sub-level of tabs
          modal: [MODAL_HOME_CREATION, {
            position: tabs.length,
            create: (newTab) => createTab(tab, newTab)
          }],
          group: trans('management')
        }, {
          name: 'configure',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-sliders',
          label: trans('configure', {}, 'actions'),
          modal: [MODAL_HOME_PARAMETERS, {
            tab: tab,
            save: (tab) => updateTab(tabs, tab.id, tab)
          }],
          group: trans('management'),
          primary: true
        }, {
          name: 'move',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-arrows',
          label: trans('move', {}, 'actions'),
          disabled: 1 >= tabs.length,
          modal: [MODAL_HOME_POSITION, {
            tab: tab,
            tabs: flattenTabs(tabs),
            selectAction: (position) => ({
              type: CALLBACK_BUTTON,
              label: trans('move', {}, 'actions'),
              callback: () => moveTab(tabs, tab.id, position)
            })
          }],
          group: trans('management')
        }, {
          name: 'delete',
          type: CALLBACK_BUTTON,
          label: trans('delete', {}, 'actions'),
          icon: 'fa fa-fw fa-trash',
          dangerous: true,
          confirm: {
            title: trans('home_tab_delete_confirm_title', {}, 'home'),
            message: trans('home_tab_delete_confirm_message', {}, 'home'),
            subtitle: getTabTitle({type: contextType, data: contextData}, tab)
          },
          disabled: 1 >= tabs.length,
          callback: () => deleteTab(tabs, tab),
          group: trans('management')
        }
      ],
      children: tab.children ? tab.children.map((tab) => getTabSummary(tab, true)) : []
    }
  }

  return (
    <EditorPage
      title={trans('Pages')}
      help={trans('Créez et organizez les différentes pages de votre accueil.')}
    >
      <ContentSummary
        links={tabs.map(getTabSummary)}
        noCollapse={true}
      />

      <Button
        type={MODAL_BUTTON}
        className={classes('btn btn-primary w-100 mt-3', {
          'btn-wave': isEmpty(tabs)
        })}
        label={trans('add_tab', {}, 'home')}
        size="lg"
        modal={[MODAL_HOME_CREATION, {
          position: tabs.length,
          create: (tab) => createTab(null, tab)
        }]}
      />
    </EditorPage>
  )
}

export {
  HomeEditorSummary
}
