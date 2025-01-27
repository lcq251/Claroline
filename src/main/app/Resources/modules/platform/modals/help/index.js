/**
 * Help modal.
 * It displays some information about the app and useful links you usually find in a website footer.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {HelpModal} from '#/main/app/platform/modals/help/components/modal'

const MODAL_PLATFORM_HELP = 'MODAL_PLATFORM_HELP'

// make the modal available for use
registry.add(MODAL_PLATFORM_HELP, HelpModal)

export {
  MODAL_PLATFORM_HELP
}
