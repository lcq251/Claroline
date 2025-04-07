/**
 * Displays the progression of a user in the sequence.
 */

import {registry} from '#/main/app/modals/registry'

import {UserProgressionModal} from '#/main/evaluation/sequence/modals/user-progression/containers/modal'

const MODAL_USER_PROGRESSION = 'MODAL_SEQUENCE_USER_PROGRESSION'

registry.add(MODAL_USER_PROGRESSION, UserProgressionModal)

export {
  MODAL_USER_PROGRESSION
}
