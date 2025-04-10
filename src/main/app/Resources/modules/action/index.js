/**
 * Action module.
 */

// Components
import {Button} from '#/main/app/action/components/button'
import {Toolbar} from '#/main/app/action/components/toolbar'

// PropTypes
import {
  Action as ActionTypes,
  PromisedAction as PromisedActionTypes,
  Toolbar as ToolbarTypes
} from '#/main/app/action/prop-types'

// Constants
import {constants} from '#/main/app/action/constants'

/**
 * Declare a new action to the application.
 *
 * NB1. Action MUST be registered in the `plugin.js` file of its plugin.
 */
function declareAction(actionDefinition) {
  return actionDefinition
}

// public module api
export {
  declareAction,
  constants,

  ActionTypes,
  PromisedActionTypes,
  ToolbarTypes,

  Button,
  Toolbar
}
