import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ToolEditor} from '#/main/core/tool/editor'

import {Tab as TabTypes} from '#/plugin/home/prop-types'
import {flattenTabs} from '#/plugin/home/tools/home/utils'

import {EditorTab} from '#/plugin/home/tools/home/editor/components/tab'
import {useSelector} from 'react-redux'
import {selectors} from '#/plugin/home/tools/home/store'
import {HomeEditorOverview} from '#/plugin/home/tools/home/editor/containers/overview'

const HomeEditor = props => {
  const tabs = useSelector(selectors.tabs)
  // const flattened = flattenTabs(props.editorTabs)

  return (
    <ToolEditor
      styles={['claroline-distribution-plugin-home-home-tool']}
      additionalData={() => ({
        tabs: tabs
      })}
      overviewPage={HomeEditorOverview}
      pages={[
        /*{
          path: '/:slug',
          render: (routeProps) => {

            if (flattened.find(tab => tab.slug === routeProps.match.params.slug)) {
              return (
                <EditorTab
                  {...props}
                />
              )
            }

            // tab does not exist, let redirection open the first available
            routeProps.history.replace(editorPath)

            return null
          }
        }*/
      ]}
    />
  )
}
HomeEditor.propTypes = {
  path: T.string.isRequired,
  tabs: T.arrayOf(T.shape(
    TabTypes.propTypes
  )),
  editorTabs: T.arrayOf(T.shape(
    TabTypes.propTypes
  ))
}

export {
  HomeEditor
}
