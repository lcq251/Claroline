
import {registry} from '#/main/app/modals/registry'

import {CommandPaletteModal} from '#/main/app/context/modals/command-palette/components/modal'

const MODAL_COMMAND_PALETTE = 'MODAL_COMMAND_PALETTE'

registry.add(MODAL_COMMAND_PALETTE, CommandPaletteModal)

export {
  MODAL_COMMAND_PALETTE
}
