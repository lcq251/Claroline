/**
 * Security modal.
 * Embed login page, registration page and reset password.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {SecurityModal} from '#/main/app/security/modals/security/components/modal'

const MODAL_SECURITY = 'MODAL_SECURITY'

// make the modal available for use
registry.add(MODAL_SECURITY, SecurityModal)

export {
  MODAL_SECURITY
}
