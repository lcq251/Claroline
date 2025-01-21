import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Routes} from '#/main/app/router'
import {selectors as baseSelectors} from '#/main/core/tool/editor/store'

import {actions, selectors} from '#/plugin/home/tools/home/editor/store'
import {flattenTabs} from '#/plugin/home/tools/home/utils'
import {HomeEditorTab} from '#/plugin/home/tools/home/editor/components/tab'
import {HomeEditorSummary} from '#/plugin/home/tools/home/editor/components/summary'

const HomeEditorTabs = () => {
  const dispatch = useDispatch()

  const editorPath = useSelector(baseSelectors.path)
  const contextType = useSelector(baseSelectors.contextType)
  const contextData = useSelector(baseSelectors.contextData)

  const tabs = useSelector(selectors.tabs)
  const flatTabs = flattenTabs(tabs)

  const updateTab = useCallback((tabs, tabId, propValue, propPath = null) => {
    dispatch(actions.updateTab(tabs, tabId, propValue, propPath))
  }, [editorPath])

  return (
    <Routes
      path={editorPath+'/tabs'}
      routes={[
        {
          path: '/',
          exact: true,
          component: HomeEditorSummary
        }, {
          path: '/:slug',
          render: (routeProps) => {
            const currentTab = flatTabs.find(tab => tab.slug === routeProps.match.params.slug)

            if (currentTab) {
              return (
                <HomeEditorTab
                  path={editorPath+'/tabs'}
                  currentTab={currentTab}
                  tabs={tabs}
                  contextType={contextType}
                  contextData={contextData}
                  history={routeProps.history}
                  updateTab={updateTab}
                />
              )
            }

            // tab does not exist, let redirection open the first available
            routeProps.history.replace(editorPath+'/tabs')

            return null
          }
        }
      ]}
    />
  )
}

export {
  HomeEditorTabs
}
