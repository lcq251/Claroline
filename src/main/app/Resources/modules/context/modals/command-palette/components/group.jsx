import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {Toolbar} from '#/main/app/action'
import {Action as ActionTypes} from '#/main/app/action/prop-types'

const CommandPaletteGroup = (props) => {
  let matchCommands = []

  if (!isEmpty(props.search)) {
    props.actions.map(action => {
      if (action.label.includes(props.search)) {
        matchCommands.push(Object.assign({}, action, {
          label: action.label.replace(props.search, '<b class="fw-bold">'+props.search+'</b>')
        }))
      }
    })
  } else {
    matchCommands = props.actions
  }

  if (isEmpty(matchCommands)) {
    return null
  }

  return (
    <div className={classes('command-palette-group', props.className)} role="presentation">
      <h5 className="fs-sm text-uppercase text-body-secondary p-4 pb-0 mb-0">{props.name}</h5>

      <Toolbar
        role="menu"
        className="command-palette-actions p-2 d-grid"
        buttonName="btn text-reset rounded-2 w-100 text-start fw-normal fs-sm"
        actions={matchCommands.map(command => Object.assign({}, command, {
          role: "menuitem",
          label: <span dangerouslySetInnerHTML={{__html: command.label}} />,
          icon : command.icon ? classes(command.icon, 'opacity-25 fs-base me-3 fa-fw') : undefined,
          onClick: () => props.onClick(command)
        }))}
      />
    </div>
  )
}

CommandPaletteGroup.propTypes = {
  className: T.string,
  search: T.string,
  name: T.string.isRequired,
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  onClick: T.func.isRequired
}

CommandPaletteGroup.defaultProps = {
  actions: []
}

export {
  CommandPaletteGroup
}
