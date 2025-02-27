
import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {ImageEditorModal} from '#/main/theme//modals/image/components/modal'

const MODAL_IMAGE_EDITOR = 'MODAL_IMAGE_EDITOR'

// make the modal available for use
registry.add(MODAL_IMAGE_EDITOR, ImageEditorModal)

export {
  MODAL_IMAGE_EDITOR
}
