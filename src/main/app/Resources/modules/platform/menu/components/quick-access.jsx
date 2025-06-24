import React, {useId, useState} from 'react'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {goToContent, goToContextMenu, goToToolMenu} from '#/main/app/platform/nav'

/**
 * Shortcut links appearing on focus to access the main section of the app:
 *    - Go to context menu
 *    - Go to tool menu
 *    - Go to page content
 */
const PlatformMenuQuickAccess = (props) => {
  const quickAccessTitleId = useId()
  const quickAccessDescId = useId()
  const [quickAccess, setQuickAccess] = useState(false)

  return (
    <>
      <h2 id={quickAccessTitleId} className="visually-hidden">{trans('quick_access_links')}</h2>
      <p id={quickAccessDescId} className="visually-hidden">{trans('quick_access_links_help')}</p>
      <ul
        className={classes('app-main-menu-group list-unstyled d-flex gap-2', {
          'visually-hidden': !quickAccess
        })}
        aria-labelledby={quickAccessTitleId}
        aria-describedby={quickAccessDescId}
        onFocus={() => {
          setQuickAccess(true)
        }}
        onBlur={(e) => {
          // only hide the quick access menu if the element getting the focus is not a quick access link
          if (!e.relatedTarget || !e.relatedTarget.className.includes('app-quick-access')) {
            setQuickAccess(false)
          }
        }}
      >
        <li>
          <Button
            type={CALLBACK_BUTTON}
            className="app-context-btn app-quick-access focus-ring"
            icon="fa fa-fw fa-font"
            label={trans('go_to_content', {}, 'actions')}
            tooltip={props.vertical ? 'right' : 'top'}
            callback={goToContent}
          />
        </li>
        <li>
          <Button
            type={CALLBACK_BUTTON}
            className="app-context-btn app-quick-access focus-ring"
            icon="fa fa-fw fa-book"
            label={trans('go_to_context_menu', {}, 'actions')}
            tooltip={props.vertical ? 'right' : 'top'}
            callback={goToContextMenu}
          />
        </li>
        <li>
          <Button
            type={CALLBACK_BUTTON}
            className="app-context-btn app-quick-access focus-ring"
            icon="fa fa-fw fa-tools"
            label={trans('go_to_tool_menu', {}, 'actions')}
            tooltip={props.vertical ? 'right' : 'top'}
            callback={goToToolMenu}
          />
        </li>
      </ul>
      <hr
        className={classes('app-main-menu-separator m-0', {
          'visually-hidden': !quickAccess
        })}
        aria-hidden={true}
      />
    </>
  )
}

export {
  PlatformMenuQuickAccess
}
