import React, {Component, createElement} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_HOME_PARAMETERS} from '#/plugin/home/tools/home/editor/modals/parameters'
import {Tab as TabTypes} from '#/plugin/home/prop-types'
import {getTabTitle} from '#/plugin/home/tools/home/utils'
import {getTab} from '#/plugin/home/home'

import {getFormDataPart} from '#/plugin/home/tools/home/editor/utils'
import {EditorPage} from '#/main/app/editor'
import {scrollTo} from '#/main/app/dom/scroll'

class HomeEditorTab extends Component {
  constructor(props) {
    super(props)

    this.state = {
      parameters: null
    }
  }

  componentDidMount() {
    if (this.props.currentTab) {
      getTab(this.props.currentTab.type).then(tabApp => this.setState({
        parameters: tabApp.parameters
      }))
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentTab && get(prevProps, 'currentTab.type') !== get(this.props, 'currentTab.type')) {
      getTab(this.props.currentTab.type).then(tabApp => this.setState({
        parameters: tabApp.parameters
      }))
    }
  }

  renderParameters() {
    if (this.props.currentTab && this.state.parameters) {
      return createElement(this.state.parameters, {
        path: `${this.props.path}/${this.props.currentTab ? this.props.currentTab.slug : ''}`,
        currentContext: {type: this.props.contextType, data: this.props.contextData}, // deprecated
        contextType: this.props.contextType,
        contextData: this.props.contextData,
        tabs: this.props.tabs,
        currentTab: this.props.currentTab,
        title: getTabTitle({type: this.props.contextType, data: this.props.contextData}, this.props.currentTab),
        update: (prop, data, tabId = null) => {
          if (tabId === null) {
            tabId = this.props.currentTab.id
          }

          this.props.updateTab(this.props.tabs, tabId, data, 'parameters.' + prop)
        }
      })
    }

    return null
  }

  render() {
    return (
      <EditorPage
        title={getTabTitle({type: this.props.contextType, data: this.props.contextData}, this.props.currentTab)}
        dataPart={getFormDataPart(this.props.currentTab.id, this.props.tabs)}
        actions={[
          {
            name: 'summary',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-list',
            label: trans('open-summary', {}, 'actions'),
            target: this.props.path,
            exact: true,
            onClick: () => scrollTo('.app-editor-body')
          }, {
            name: 'configure',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-sliders',
            label: trans('configure', {}, 'actions'),
            modal: [MODAL_HOME_PARAMETERS, {
              tab: this.props.currentTab,
              save: (tab) => this.props.updateTab(this.props.tabs, tab.id, tab)
            }],
            group: trans('management')
          }
        ]}
      >
        {this.renderParameters()}
      </EditorPage>
    )
  }
}

HomeEditorTab.propTypes = {
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  path: T.string.isRequired,
  contextType: T.string.isRequired,
  contextData: T.object,
  tabs: T.arrayOf(T.shape(
    TabTypes.propTypes
  )),
  currentTab: T.shape(
    TabTypes.propTypes
  ).isRequired
}

export {
  HomeEditorTab
}
