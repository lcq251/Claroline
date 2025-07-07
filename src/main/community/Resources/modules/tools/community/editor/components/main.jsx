import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {ToolEditor} from '#/main/core/tool/editor'
import {selectors as toolSelectors, constants as toolConstants} from '#/main/core/tool'

import {selectors} from '#/main/community/tools/community/store'

import {CommunityEditorProfile} from '#/main/community/tools/community/editor/components/profile'
import {CommunityEditorParameters} from '#/main/community/tools/community/editor/components/parameters'

const CommunityEditor = () => {
  const contextType = useSelector(toolSelectors.contextType)

  // community tool params
  const profile = useSelector(selectors.profile)
  const parameters = useSelector(selectors.parameters)

  return (
    <ToolEditor
      additionalData={() => ({
        parameters: parameters,
        profile: profile
      })}
      overviewPage={CommunityEditorParameters}
      pages={[
        {
          name: 'profile',
          title: trans('user_profile'),
          component: CommunityEditorProfile,
          disabled: contextType !== toolConstants.TOOL_DESKTOP
        }
      ]}
    />
  )
}

export {
  CommunityEditor
}
