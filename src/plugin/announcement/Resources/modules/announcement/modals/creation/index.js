/**
 * Announcement creation modal.
 * Displays a modal to create a new announcement.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {CreationModal} from '#/plugin/announcement/announcement/modals/creation/components/modal'

const MODAL_ANNOUNCEMENT_CREATION = 'MODAL_ANNOUNCEMENT_CREATION'

// make the modal available for use
registry.add(MODAL_ANNOUNCEMENT_CREATION, CreationModal)

export {
  MODAL_ANNOUNCEMENT_CREATION
}
