import React, {createElement} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {toKey} from '#/main/app/utils/text'
import {Button, Toolbar} from '#/main/app/action'
import {Action, PromisedAction} from '#/main/app/action/prop-types'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {useSelector} from 'react-redux'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

const PageMenu = (props) => {
  const isAuthenticated = useSelector(securitySelectors.isAuthenticated)

  let displayedNav = []
  if (!isEmpty(props.nav)) {
    displayedNav = props.nav
      .filter(action => undefined === action.displayed || action.displayed)
  }

  return (
    <div className={classes('app-page-menu px-4 d-flex gap-4 flex-nowrap align-items-stretch bg-body z-2')} role="presentation">
      {!props.embedded && props.affix && createElement(props.affix, {
        name: props.name
      })}

      {props.children}

      {(0 < displayedNav.length || props.actions || (!props.embedded && !isAuthenticated)) &&
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
              toolbar={props.toolbar || 'more'}
              tooltip="bottom"
              actions={props.actions}
              role="toolbar"
            />
          }

          {!props.embedded && !isAuthenticated &&
            <Button
              className="btn btn-primary my-auto fs-sm me-n3"
              type={LINK_BUTTON}
              label={trans('login')}
              target="/login"
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
  ]),
  children: T.node
}

export {
  PageMenu
}
