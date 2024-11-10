import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Tool, ToolPage} from '#/main/core/tool'

import {AppearanceParameters} from '#/main/theme/administration/appearance/containers/parameters'
import {selectors} from '#/main/theme/administration/appearance/store'
import {ThemeForm} from '#/main/theme/theme/components/form'
import {trans} from '#/main/app/intl'
import {LINK_BUTTON} from '#/main/app/buttons'

const AppearanceTool = (props) =>
  <Tool
    {...props}
    styles={['claroline-distribution-main-theme-administration-appearance']}
    menu={[
      {
        name: 'overview',
        type: LINK_BUTTON,
        label: trans('overview'),
        target: props.path,
        exact: true
      }, {
        name: 'theme',
        type: LINK_BUTTON,
        label: trans('theme', {}, 'appearance'),
        target: props.path+'/theme'
      }
    ]}
    pages={[
      {
        path: '/',
        exact: true,
        component: AppearanceParameters
      }, {
        path: '/theme',
        render: () => (
          <ToolPage title={trans('theme', {}, 'appearance')}>
            <ThemeForm name={selectors.THEME_NAME} className="my-5" />
          </ToolPage>
        )
      }
    ]}
  />

AppearanceTool.propTypes = {
  path: T.string.isRequired
}

export {
  AppearanceTool
}
