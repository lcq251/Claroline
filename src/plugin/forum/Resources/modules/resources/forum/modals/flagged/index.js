/**
 * Subject form modal.
 * Displays a form to configure a forum subject.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {FlaggedModal} from '#/plugin/forum/resources/forum/modals/flagged/components/modal'

const MODAL_FORUM_FLAGGED = 'MODAL_FORUM_FLAGGED'

// make the modal available for use
registry.add(MODAL_FORUM_FLAGGED, FlaggedModal)

export {
  MODAL_FORUM_FLAGGED
}
