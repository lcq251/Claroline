/**
 * Subject form modal.
 * Displays a form to create/configure a forum subject.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {SubjectModal} from '#/plugin/forum/resources/forum/modals/subject/components/modal'

const MODAL_SUBJECT = 'MODAL_SUBJECT'

// make the modal available for use
registry.add(MODAL_SUBJECT, SubjectModal)

export {
  MODAL_SUBJECT
}
