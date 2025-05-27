/**
 * IP Parameters modal.
 * Displays a form to configure an IP.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {IpFormModal} from '#/main/authentication/ip/modals/form/components/modal'

const MODAL_IP_FORM = 'MODAL_IP_FORM'

// make the modal available for use
registry.add(MODAL_IP_FORM, IpFormModal)

export {
  MODAL_IP_FORM
}
