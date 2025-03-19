import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {SharedModal} from '#/plugin/claco-form/resources/claco-form/player/modals/shared/containers/modal'

const MODAL_ENTRY_SHARED = 'MODAL_ENTRY_SHARED'

// make the modal available for use
registry.add(MODAL_ENTRY_SHARED, SharedModal)

export {
  MODAL_ENTRY_SHARED
}
