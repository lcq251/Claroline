/**
 * Template form modal.
 * Displays a form to create/configure a template.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {TemplateFormModal} from '#/main/template/template/modals/form/components/modal'

const MODAL_TEMPLATE_FORM = 'MODAL_GROUP_FORM'

// make the modal available for use
registry.add(MODAL_TEMPLATE_FORM, TemplateFormModal)

export {
  MODAL_TEMPLATE_FORM
}
