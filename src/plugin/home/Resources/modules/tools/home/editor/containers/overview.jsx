import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {HomeEditorOverview as HomeEditorOverviewComponent} from '#/plugin/home/tools/home/editor/components/overview'
import {actions, selectors} from '#/plugin/home/tools/home/store'
import {actions as editorActions, selectors as editorSelectors, reducer as editorReducer} from '#/plugin/home/tools/home/editor/store'
import {actions as formActions} from '#/main/app/content/form/store'

const HomeEditorOverview =
  connect(
    (state) => {
      return ({
        //path: toolSelectors.path(state),
        //editorTabs: editorSelectors.editorTabs(state),
        //currentTabTitle: editorSelectors.currentTabTitle(state),
        //currentTab: editorSelectors.currentTab(state)
      })
    },
    (dispatch) => ({
      createTab(parent = null, tab, navigate) {
        dispatch(editorActions.createTab(parent, tab, navigate))
      },
      moveTab(tabId, newPosition) {
        dispatch(editorActions.moveTab(tabId, newPosition))
      },
      updateTab(tabs, tabId, data, path = null) {
        dispatch(editorActions.updateTab(tabs, tabId, data, path))
      },
      deleteTab(tabs, currentTab) {
        dispatch(editorActions.deleteTab(tabs, currentTab))
      }
    })
  )(HomeEditorOverviewComponent)

export {
  HomeEditorOverview
}
