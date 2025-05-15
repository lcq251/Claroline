import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {Button} from '#/main/app/action'

import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {MENU_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

const PageActions = (props) => {
  if (isEmpty(props.actions)) {
    return null
  }

  let actions = [].concat(props.actions)

  let primaryAction
  if (props.primaryAction) {
    const primaryPos = actions.findIndex(action => action.name === props.primaryAction)
    if (-1 !== primaryPos) {
      primaryAction = actions[primaryPos]
      actions.splice(primaryPos, 1)
    }
  }

  if (!primaryAction) {
    primaryAction = actions[0]
    actions.splice(0, 1)
  }

  return (
    <div className="btn-group ms-auto d-flex flex-nowrap" role="toolbar">
      {primaryAction && (undefined === primaryAction.displayed || primaryAction.displayed) &&
        <Button
          {...primaryAction}
          className="btn btn-body"
          //icon={undefined}
          size="sm"
          disabled={props.disabled || props.primaryAction.disabled}
        />
      }

      {!isEmpty(actions) &&
        <Button
          className="btn btn-body"
          type={MENU_BUTTON}
          icon="fa fa-chevron-down text-body-tertiary fs-sm"
          tooltip="bottom"
          label={trans('show-more-actions', {}, 'actions')}
          disabled={props.disabled}
          menu={{
            items: actions,
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
   * The name of an optional primary action of the page.
   * NB. The action MUST be defined in the `actions` list.
   */
  primaryAction: T.string,

  /**
   * The list of actions available for the current page.
   * NB. This list MUST contain the actions for `primaryAction` and `secondaryAction` if defined.
   *
   * @type {Array}
   */
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  size: T.oneOf(['sm', 'lg'])
}

export {
  PageActions
}
