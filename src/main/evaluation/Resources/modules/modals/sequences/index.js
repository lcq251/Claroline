/**
 * Sequences picker modal.
 *
 * Displays the sequences picker inside the modal.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {SequencesModal} from '#/main/evaluation/modals/sequences/components/modal'

const MODAL_SEQUENCES = 'MODAL_SEQUENCES'

// make the modal available for use
registry.add(MODAL_SEQUENCES, SequencesModal)

export {
  MODAL_SEQUENCES
}
