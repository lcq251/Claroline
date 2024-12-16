/**
 * Tag form modal.
 * Displays a form to create/configure a tag.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {TagModal} from '#/plugin/tag/tools/tags/modals/tag/components/modal'

const MODAL_TAG = 'MODAL_TAG'

// make the modal available for use
registry.add(MODAL_TAG, TagModal)

export {
  MODAL_TAG
}
