/**
 * User Creation modal.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {UserCreationModal} from '#/main/community/user/modals/creation/containers/modal'

const MODAL_USER_CREATION = 'MODAL_USER_CREATION'

// make the modal available for use
registry.add(MODAL_USER_CREATION, UserCreationModal)

export {
  MODAL_USER_CREATION
}
