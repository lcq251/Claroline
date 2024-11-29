import {connect} from 'react-redux'

import {AdministrationMenu as AdministrationMenuComponent} from '#/main/app/contexts/administration/components/menu'
import {selectors as contextSelectors} from '#/main/app/context/store'

const AdministrationMenu = connect(
  (state) => ({
    tools: contextSelectors.accessibleTools(state)
  })
)(AdministrationMenuComponent)

export {
  AdministrationMenu
}
