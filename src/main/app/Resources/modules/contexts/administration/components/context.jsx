import React from 'react'

import {AppContext as AppContextTypes} from '#/main/app/context/prop-types'

import {ContextMain} from '#/main/app/context/containers/main'

import {AdministrationLoading} from '#/main/app/contexts/administration/components/loading'
import {AdministrationMenu} from '#/main/app/contexts/administration/containers/menu'

const AdministrationContext = (props) =>
  <ContextMain
    {...props}
    menu={AdministrationMenu}
    loadingPage={AdministrationLoading}
  />

AdministrationContext.propTypes = AppContextTypes.propTypes

export {
  AdministrationContext
}
