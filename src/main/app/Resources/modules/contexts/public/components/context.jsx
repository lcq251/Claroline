import React from 'react'

import {AppContext as AppContextTypes} from '#/main/app/context/prop-types'

import {ContextMain} from '#/main/app/context/containers/main'

import {PublicMenu} from '#/main/app/contexts/public/containers/menu'

const PublicContext = (props) =>
  <ContextMain
    {...props}
    menu={PublicMenu}
  />

PublicContext.propsTypes = AppContextTypes.propTypes

export {
  PublicContext
}
