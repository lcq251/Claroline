/**
 * Session event form modal.
 * Displays a form to create a session event.
 */

import {registry} from '#/main/app/modals/registry'

import {EventFormModal} from '#/plugin/cursus/event/modals/form/components/modal'

const MODAL_TRAINING_EVENT_FORM = 'MODAL_TRAINING_EVENT_FORM'

registry.add(MODAL_TRAINING_EVENT_FORM, EventFormModal)

export {
  MODAL_TRAINING_EVENT_FORM
}
