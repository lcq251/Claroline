/**
 * Group form modal.
 * Displays a form to create/configure a group.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {GroupFormModal} from '#/main/community/group/modals/form/components/modal'

const MODAL_GROUP_FORM = 'MODAL_GROUP_FORM'

// make the modal available for use
registry.add(MODAL_GROUP_FORM, GroupFormModal)

export {
  MODAL_GROUP_FORM
}
