/**
 * "Link resources" modal.
 *
 * Opens a modal to configure the resources linked as inputs of the web resource.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {InputsModal} from '#/plugin/web-resource/resources/web-resource/components/inputs-modal'

const MODAL_LINK_RESOURCES = 'MODAL_LINK_RESOURCES'

// make the modal available for use
registry.add(MODAL_LINK_RESOURCES, InputsModal)

export {
  MODAL_LINK_RESOURCES
}
