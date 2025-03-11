/**
 * Platform search modal.
 * It displays a search field to retrieve various entities (workspaces, resources, users, etc.).
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {SearchModal} from '#/main/app/platform/modals/search/containers/modal'

const MODAL_SEARCH = 'MODAL_SEARCH'

// make the modal available for use
registry.add(MODAL_SEARCH, SearchModal)

export {
  MODAL_SEARCH
}
