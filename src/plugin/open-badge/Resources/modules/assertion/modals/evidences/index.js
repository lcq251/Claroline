
import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {EvidencesModal} from '#/plugin/open-badge/assertion/modals/evidences/containers/modal'

const MODAL_BADGE_EVIDENCES = 'MODAL_BADGE_EVIDENCES'

// make the modal available for use
registry.add(MODAL_BADGE_EVIDENCES, EvidencesModal)

export {
  MODAL_BADGE_EVIDENCES
}
