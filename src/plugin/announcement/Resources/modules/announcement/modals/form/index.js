/**
 * Announcement form modal.
 * Displays a form to create/configure aa announcement.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {AnnouncementFormModal} from '#/plugin/announcement/announcement/modals/form/components/modal'

const MODAL_ANNOUNCEMENT_FORM = 'MODAL_ANNOUNCEMENT_FORM'

// make the modal available for use
registry.add(MODAL_ANNOUNCEMENT_FORM, AnnouncementFormModal)

export {
  MODAL_ANNOUNCEMENT_FORM
}
