/**
 * Field creation modal.
 * Displays a modal to select a field type and configure it.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {CreationModal} from '#/main/app/data/types/fields/modals/creation/components/modal'

const MODAL_FIELD_CREATION = 'MODAL_FIELD_CREATION'

// make the modal available for use
registry.add(MODAL_FIELD_CREATION, CreationModal)

export {
  MODAL_FIELD_CREATION
}
