import React from 'react'

import {AppContext as AppContextTypes} from '#/main/app/context/prop-types'

import {ContextMain} from '#/main/app/context/containers/main'

const PublicContext = (props) =>
  <ContextMain
    {...props}
  />

PublicContext.propsTypes = AppContextTypes.propTypes

export {
  PublicContext
}
