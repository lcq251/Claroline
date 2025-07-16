import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {Button} from '#/main/app/action'

import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {MENU_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

const PageActions = ({
  primaryAction = null,
  actions = [],
  disabled = false
}) => {
  let displayedActions = []
    .concat(actions || [])
    .filter(action => undefined === action.displayed || action.displayed)

  let primary
  if (!isEmpty(displayedActions) && primaryAction) {
    const primaryPos = displayedActions.findIndex(action => action.name === primaryAction)
    if (-1 !== primaryPos) {
      primary = displayedActions[primaryPos]
      displayedActions.splice(primaryPos, 1)
    }
  }

  if (!isEmpty(displayedActions) && !primaryAction) {
    primary = displayedActions[0]
    displayedActions.splice(0, 1)
  }

  if (isEmpty(primary) && isEmpty(displayedActions)) {
    return null
  }

  return (
    <div className="btn-group ms-auto d-flex flex-nowrap" role="toolbar">
      {primary &&
        <Button
          {...primary}
          className="btn btn-body"
          size="sm"
          disabled={disabled || primary.disabled}
        />
      }

      {!isEmpty(displayedActions) &&
        <Button
          className="btn btn-body"
          type={MENU_BUTTON}
          icon="fa fa-chevron-down text-body-tertiary fs-sm"
          tooltip="bottom"
          label={trans('show-more-actions', {}, 'actions')}
          disabled={disabled}
          menu={{
            items: displayedActions,
            align: 'end'
          }}
          size="sm"
        />
      }
    </div>
  )
}

PageActions.propTypes = {
  disabled: T.bool,

  /**
   * The name of an optional primary action for the page.
   * NB. The action MUST be defined in the `actions` list.
   */
  primaryAction: T.string,

  /**
   * The list of actions available for the current page.
   * NB. This list MUST contain the actions for `primaryAction` if defined.
   *
   * @type {Array}
   */
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  ))
}

export {
  PageActions
}
