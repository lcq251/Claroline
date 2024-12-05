import React from 'react'
import omit from 'lodash/omit'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {Button} from '#/main/app/action'
import {Action as ActionTypes} from '#/main/app/action/prop-types'

const CommandPaletteGroup = (props) => {
  if (isEmpty(props.actions)) {
    return null
  }

  return (
    <div className={classes('command-palette-group', props.className)} role="menu">
      <h5 className="fs-sm text-uppercase text-body-secondary p-4 pb-0 mb-0">{props.name}</h5>

      <ul className="list-unstyled command-palette-actions p-2 d-grid mb-0">
        {props.actions.map(command =>
          <li key={command.name}>
            <Button
              {...omit(command, 'commandType')}
              role="menuitem"
              id={`cmd-${command.name}`}
              className={classes('btn text-reset d-flex align-items-center rounded-2 w-100 text-start fw-normal fs-sm', {
                'command-palette-active': props.activeCommand === command.name
              })}
              icon={command.icon ? classes(command.icon, 'opacity-25 fs-base me-3 fa-fw') : undefined}
              label={
                <>
                  <span dangerouslySetInnerHTML={{__html: command.label}} role="presentation" />
                  {'page' === command.commandType && props.activeCommand === command.name &&
                    <span className="ms-auto" role="presentation" aria-hidden={true}>Ouvrir...</span>
                  }
                </>
              }
              onClick={() => props.onClick(command)}
              onMouseOver={() => props.setActiveCommand(command.name)}
            />
          </li>
        )}
      </ul>
    </div>
  )
}

CommandPaletteGroup.propTypes = {
  className: T.string,
  name: T.string.isRequired,
  activeCommand: T.string,
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  onClick: T.func.isRequired,
  setActiveCommand: T.func.isRequired
}

CommandPaletteGroup.defaultProps = {
  actions: []
}

export {
  CommandPaletteGroup
}
