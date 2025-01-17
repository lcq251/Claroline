/**
 * Displays the image in fullscreen.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {FullscreenModal} from '#/plugin/image-player/resources/image/modals/fullscreen/components/modal'

const MODAL_IMAGE_FULLSCREEN = 'MODAL_IMAGE_FULLSCREEN'

// make the modal available for use
registry.add(MODAL_IMAGE_FULLSCREEN, FullscreenModal)

export {
  MODAL_IMAGE_FULLSCREEN
}
