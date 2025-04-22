/**
 * Badge rule parameters modal.
 * Displays a modal to configure a rule.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {ParametersModal} from '#/plugin/open-badge/badge-rule/modals/parameters/components/modal'

const MODAL_BADGE_RULE_PARAMETERS = 'MODAL_BADGE_RULE_PARAMETERS'

// make the modal available for use
registry.add(MODAL_BADGE_RULE_PARAMETERS, ParametersModal)

export {
  MODAL_BADGE_RULE_PARAMETERS
}
