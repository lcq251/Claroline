
import {withReducer} from '#/main/app/store/components/withReducer'

import {EvidencesModal as EvidencesModalComponent} from '#/plugin/open-badge/assertion/modals/evidences/components/modal'
import {reducer, selectors} from '#/plugin/open-badge/assertion/modals/evidences/store'

const EvidencesModal = withReducer(selectors.STORE_NAME, reducer)(
  EvidencesModalComponent
)

export {
  EvidencesModal
}
