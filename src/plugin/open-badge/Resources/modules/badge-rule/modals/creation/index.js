/**
 * Badge rule creation modal.
 * Displays a modal to select a rule type and configure it.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {CreationModal} from '#/plugin/open-badge/badge-rule/modals/creation/components/modal'

const MODAL_BADGE_RULE_CREATION = 'MODAL_BADGE_RULE_CREATION'

// make the modal available for use
registry.add(MODAL_BADGE_RULE_CREATION, CreationModal)

export {
  MODAL_BADGE_RULE_CREATION
}
