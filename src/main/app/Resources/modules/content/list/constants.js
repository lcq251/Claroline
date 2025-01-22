import {constants as paginationConst} from '#/main/app/content/pagination/constants'

import {constants as gridConst} from '#/main/app/content/list/grid/constants'
import {constants as tableConst} from '#/main/app/content/list/table/constants'

const DEFAULT_DISPLAY_MODE = tableConst.DISPLAY_TABLE
const DEFAULT_DISPLAY_MODES = [
  tableConst.DISPLAY_TABLE,
  gridConst.DISPLAY_TILES,
  gridConst.DISPLAY_LIST
]

/**
 * List of implemented display modes for lists.
 *
 * @type {object}
 */
const DISPLAY_MODES = [
  tableConst.DISPLAY_TABLE,
  gridConst.DISPLAY_TILES,
  gridConst.DISPLAY_LIST
]

// reexport pagination constants here for retro compatibility
export const constants = Object.assign({}, paginationConst, gridConst, tableConst, {
  DISPLAY_MODES,
  DEFAULT_DISPLAY_MODE,
  DEFAULT_DISPLAY_MODES
})
