import {connect} from 'react-redux'

import {hasPermission} from '#/main/app/security'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {PresenceList as PresenceListComponent} from '#/plugin/cursus/tools/trainings/presence/components/list'

const PresenceList = connect(
  (state) => ({
    path: toolSelectors.path(state),
    contextId: toolSelectors.contextId(state),
    canEdit: hasPermission('edit', toolSelectors.toolData(state)),
    canRegister: hasPermission('register', toolSelectors.toolData(state))
  })
)(PresenceListComponent)

export {
  PresenceList
}
