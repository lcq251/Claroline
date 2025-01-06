import React, {createElement} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {toKey} from '#/main/app/utils/text'
import {Button, Toolbar} from '#/main/app/action'
import {Action, PromisedAction} from '#/main/app/action/prop-types'

const PageMenu = (props) => {
  const displayedNav = props.nav
    .filter(action => undefined === action.displayed || action.displayed)

  return (
    <div className={classes('app-page-menu px-4 d-flex gap-4 flex-nowrap align-items-stretch bg-body', {
      'sticky-top': !props.embedded
    })} role="presentation">
      {!props.embedded && props.affix && createElement(props.affix)}

      {(0 < displayedNav.length || props.actions) &&
        <div className="ms-auto d-flex flex-nowrap gap-4 fs-sm" role="presentation">
          {0 < displayedNav.length &&
            <nav className="text-nowrap d-flex">
              <ul className="nav nav-underline flex-nowrap">
                {displayedNav.map((nav) =>
                  <li className="nav-item" key={nav.name || toKey(nav.label)}>
                    <Button
                      {...nav}
                      className="nav-link fw-bolder"
                    />
                  </li>
                )}
              </ul>
            </nav>
          }

          {props.actions &&
            <Toolbar
              className="nav nav-underline flex-nowrap gap-4 d-flex"
              buttonName="nav-link fw-bolder"
              toolbar={props.toolbar}
              tooltip="bottom"
              actions={props.actions}
            />
          }
        </div>
      }
    </div>
  )
}

PageMenu.propTypes = {
  embedded: T.bool.isRequired,

  /**
   * The main navigation elements.
   */
  nav: T.arrayOf(T.shape(
    Action.propTypes
  )),
  toolbar: T.string,

  /**
   * A list of actions.
   */
  actions: T.oneOfType([
    // a regular array of actions
    T.arrayOf(T.shape(
      Action.propTypes
    )),
    // a promise that will resolve a list of actions
    T.shape(
      PromisedAction.propTypes
    )
  ])
}

PageMenu.defaultProps = {
  nav: [],
  toolbar: 'more'
}

export {
  PageMenu
}
