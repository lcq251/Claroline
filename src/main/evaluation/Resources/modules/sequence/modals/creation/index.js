/**
 * Sequence creation modal.
 *
 * Displays the sequence creation inside the modal.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {CreationModal} from '#/main/evaluation/sequence/modals/creation/containers/main'

const MODAL_SEQUENCE_CREATION = 'MODAL_SEQUENCE_CREATION'

// make the modal available for use
registry.add(MODAL_SEQUENCE_CREATION, CreationModal)

export {
  MODAL_SEQUENCE_CREATION
}
