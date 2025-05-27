/**
 * Token Parameters modal.
 * Displays a form to configure an authentication token.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {TokenFormModal} from '#/main/authentication/token/modals/form/components/modal'

const MODAL_TOKEN_FORM = 'MODAL_TOKEN_FORM'

// make the modal available for use
registry.add(MODAL_TOKEN_FORM, TokenFormModal)

export {
  MODAL_TOKEN_FORM
}
