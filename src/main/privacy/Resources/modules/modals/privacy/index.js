/**
 * Privacy modal.
 *
 * Displays the platform privacy policy.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {PrivacyModal} from '#/main/privacy/modals/privacy/components/modal'

const MODAL_PRIVACY = 'MODAL_PRIVACY'

// make the modal available for use
registry.add(MODAL_PRIVACY, PrivacyModal)

export {
  MODAL_PRIVACY
}
