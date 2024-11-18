
import {registry} from '#/main/app/modals/registry'

import {CommandsModal} from '#/plugin/cursus/tools/trainings/modals/commands/components/modal'

const MODAL_TRAINING_COMMANDS = 'MODAL_TRAINING_COMMANDS'

registry.add(MODAL_TRAINING_COMMANDS, CommandsModal)

export {
  MODAL_TRAINING_COMMANDS
}
