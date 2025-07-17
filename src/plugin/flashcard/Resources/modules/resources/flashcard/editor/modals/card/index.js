/**
 * Card form modal.
 */
import {registry} from '#/main/app/modals/registry'
import {CardModal} from '#/plugin/flashcard/resources/flashcard/editor/modals/card/components/modal'

const MODAL_CARD = 'MODAL_CARD'

registry.add(MODAL_CARD, CardModal)

export {
  MODAL_CARD
}
