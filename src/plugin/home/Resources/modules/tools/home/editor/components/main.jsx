import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ToolEditor} from '#/main/core/tool/editor'

import {selectors} from '#/plugin/home/tools/home/store'
import {HomeEditorTabs} from '#/plugin/home/tools/home/editor/components/tabs'

const HomeEditor = () => {
  const tabs = useSelector(selectors.tabs)

  return (
    <ToolEditor
      styles={['claroline-distribution-plugin-home-home-tool']}
      additionalData={() => ({
        tabs: tabs
      })}
      pages={[
        {
          name: 'tabs',
          title: trans('Pages', {}, 'home'),
          component: HomeEditorTabs
        }
      ]}
    />
  )
}

export {
  HomeEditor
}
