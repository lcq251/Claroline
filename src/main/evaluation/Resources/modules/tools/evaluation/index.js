import {declareTool, CommandPalette} from '#/main/core/tool'

import {EvaluationTool} from '#/main/evaluation/tools/evaluation/containers/tool'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

/**
 * Evaluation tool application.
 */
export default declareTool(EvaluationTool, () => new CommandPalette('evaluation')
  .addCommands([
    {
      name: 'add-lesson-plan',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-route',
      label: trans('Ajouter un parcours d\'apprentissage', {}, 'command'),
      callback: () => true
    }, {
      name: 'correct-evaluations',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-check-double',
      label: trans('Corriger des évaluations en attente', {}, 'command'),
      callback: () => true
    }
  ])
)
