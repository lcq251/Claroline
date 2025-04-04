/**
 * Role form modal.
 * Displays a form to create/configure a role.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {RoleFormModal} from '#/main/community/role/modals/form/components/modal'

const MODAL_ROLE_FORM = 'MODAL_ROLE_FORM'

// make the modal available for use
registry.add(MODAL_ROLE_FORM, RoleFormModal)

export {
  MODAL_ROLE_FORM
}
