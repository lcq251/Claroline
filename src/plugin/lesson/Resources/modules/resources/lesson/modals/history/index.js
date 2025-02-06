/**
 * Page history modal.
 * Displays operational logs for the selected page.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {HistoryModal} from '#/plugin/lesson/resources/lesson/modals/history/components/modal'

const MODAL_PAGE_HISTORY = 'MODAL_PAGE_HISTORY'

// make the modal available for use
registry.add(MODAL_PAGE_HISTORY, HistoryModal)

export {
  MODAL_PAGE_HISTORY
}
