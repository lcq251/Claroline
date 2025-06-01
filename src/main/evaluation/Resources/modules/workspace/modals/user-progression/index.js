/**
 * Displays the progression of a user in the workspace.
 */

import {registry} from '#/main/app/modals/registry'

import {UserProgressionModal} from '#/main/evaluation/workspace/modals/user-progression/components/modal'

const MODAL_USER_PROGRESSION = 'MODAL_WORKSPACE_USER_PROGRESSION'

registry.add(MODAL_USER_PROGRESSION, UserProgressionModal)

export {
  MODAL_USER_PROGRESSION
}
