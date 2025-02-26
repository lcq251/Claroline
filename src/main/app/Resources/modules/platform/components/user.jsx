import React, {useCallback, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'

import {url} from '#/main/app/api'
import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {CallbackButton, LINK_BUTTON, MENU_BUTTON, URL_BUTTON} from '#/main/app/buttons'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {Menu} from '#/main/app/overlays/menu'

import {UserAvatar} from '#/main/app/user/components/avatar'
import {constants as userConst} from '#/main/app/user/constants'
import {displayUsername} from '#/main/community/utils'
import {selectors} from '#/main/app/context'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {actions} from '#/main/app/platform/store'

const UserMenu = (props) => {
  const dispatch = useDispatch()

  const accountLinks = [
    {
      name: 'profile',
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-user',
      label: trans('my_profile'),
      target: props.path+'/profile'
    }, {
      name: 'parameters',
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-sliders',
      label: trans('parameters'),
      target: '/account'
    }, {
      name: 'logout',
      type: URL_BUTTON,
      icon: 'fa fa-fw fa-power-off',
      label: trans('logout'),
      target: ['claro_security_logout']
    }
  ]

  const changeStatus = useCallback((status) => {
    dispatch(actions.changeStatus(props.user, status))
  }, [props.user.id])

  return (
    <Menu style={{minWidth: '20rem'}} className="rounded-4 pt-0">
      {get(props.user, 'poster') &&
        <Thumbnail thumbnail={get(props.user, 'poster')} className="z-n1 rounded-top-4"/>
      }

      <div
        className={classes('px-3', {
          'pt-3': !get(props.user, 'poster')
        })}
        role="presentation"
        style={get(props.user, 'poster') ? {marginTop: '-3.5rem'} : undefined}
      >
        <UserAvatar
          user={props.user}
          size="md"
          border={true}
        />

        <h2 className="h5 mb-0 mt-1">{displayUsername(props.user)}</h2>
        <p className="mb-2">{props.user.username}</p>
      </div>

      <ul className="list-unstyled mb-0">
        {Object.keys(userConst.USER_STATUSES).map((status) => (
          <li key={status}>
            <CallbackButton
              className="dropdown-item d-flex align-items-start focus-ring"
              callback={() => {
                changeStatus(status)
                props.closeMenu()
              }}
            >
              <span className={classes('d-inline-block p-1 my-2 rounded-circle icon-with-text-right', `bg-${userConst.USER_STATUS_COLORS[status]}`)} aria-hidden={true} />

              <span role="presentation">
                {userConst.USER_STATUSES[status]}
                {userConst.USER_STATUS_OFFLINE === status &&
                  <small className="text-body-secondary text-wrap d-block">{trans('user_offline_help')}</small>
                }
              </span>
            </CallbackButton>
          </li>
        ))}
      </ul>

      <hr className="dropdown-divider" />

      <ul className="list-unstyled mb-0">
        {accountLinks.map((accountLink) => (
          <li key={accountLink.name}>
            <Button
              className="dropdown-item focus-ring"
              onClick={props.closeMenu}
              {...accountLink}
            />
          </li>
        ))}
      </ul>

      {props.impersonated &&
        <>
          <hr className="dropdown-divider" />
          <Button
            className="dropdown-item focus-ring"
            onClick={props.closeMenu}
            {...{
              type: URL_BUTTON,
              icon: 'fa fa-fw fa-times',
              label: trans('exit_impersonation', {}, 'actions'),
              target: url(['claro_index', {_switch: '_exit'}])+'#'+location.pathname
            }}
          />
        </>
      }
    </Menu>
  )
}

UserMenu.propTypes = {
  show: T.bool,
  user: T.object.isRequired,
  impersonated: T.bool,
  path: T.string,
  closeMenu: T.func.isRequired
}

const PlatformUser = (props) => {
  const currentUser = useSelector(securitySelectors.currentUser)
  const impersonated = useSelector(securitySelectors.isImpersonated)
  const path = useSelector(selectors.path)

  const [menuOpened, setMenuOpened] = useState(false)

  return (
      <Button
        type={MENU_BUTTON}
        label={trans(impersonated ? 'impersonated_account' : 'my_account', {name: displayUsername(currentUser)})}
        tooltip="right"
        className={classes('focus-ring rounded-circle', props.className)}
        opened={menuOpened}
        onToggle={setMenuOpened}
        menu={
          <UserMenu
            impersonated={impersonated}
            user={currentUser}
            path={path}
            closeMenu={() => setMenuOpened(false)}
          />
        }
      >
        <UserAvatar user={currentUser} noStatusTooltip={true} size="sm" />
      </Button>
  )
}

PlatformUser.propTypes = {
  className: T.string
}

export {
  PlatformUser
}
