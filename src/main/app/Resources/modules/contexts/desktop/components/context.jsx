import React from 'react'

import {AppContext as AppContextTypes} from '#/main/app/context/prop-types'

import {ContextMain} from '#/main/app/context/containers/main'

import {DesktopLoading} from '#/main/app/contexts/desktop/components/loading'
import {DesktopForbidden} from '#/main/app/contexts/desktop/components/forbidden'
import {DesktopMenu} from '#/main/app/contexts/desktop/containers/menu'
import {DesktopEditor} from '#/main/app/contexts/desktop/editor/components/main'

const DesktopContext = (props) =>
  <ContextMain
    {...props}

    menu={DesktopMenu}
    editor={DesktopEditor}
    loadingPage={DesktopLoading}
    forbiddenPage={DesktopForbidden}
  />

DesktopContext.propTypes = AppContextTypes.propTypes

export {
  DesktopContext
}
