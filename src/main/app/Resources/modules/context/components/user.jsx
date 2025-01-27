import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {url} from '#/main/app/api'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, LINK_BUTTON, MENU_BUTTON, URL_BUTTON} from '#/main/app/buttons'

import {UserAvatar} from '#/main/app/user/components/avatar'
import {User as UserTypes} from '#/main/community/user/prop-types'
import {constants as userConst} from '#/main/app/user/constants'
import {displayUsername} from '#/main/community/utils'

const ContextUser = (props) => {
  return (
    <div className={classes('app-menu-user d-flex flex-column align-items-stretch', props.className)} role="presentation">
      <Button
        id="current-user-menu"
        type={MENU_BUTTON}
        label={displayUsername(props.currentUser)}
        tooltip="right"
        className="app-current-user text-start d-flex flex-row p-0 focus-ring rounded-circle"
        menu={{
          items: [].concat(Object.keys(userConst.USER_STATUSES).map((status) => ({
            name: status,
            type: CALLBACK_BUTTON,
            callback: () => props.changeStatus(props.currentUser, status),
            primary: true,
            label: (
              <div className="d-flex align-items-start" role="presentation">
                <span className={classes('d-inline-block p-1 my-2 rounded-circle icon-with-text-right', `bg-${userConst.USER_STATUS_COLORS[status]}`)} aria-hidden={true} />

                <span role="presentation">
                  {userConst.USER_STATUSES[status]}
                  {userConst.USER_STATUS_OFFLINE === status &&
                    <small className="text-body-secondary text-wrap d-block">{trans('user_offline_help')}</small>
                  }
                </span>
              </div>
            )
          })), [
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
              label: trans('my_account'),
              target: '/account'
            }, {
              name: 'help',
              type: URL_BUTTON,
              icon: 'fa fa-fw fa-info-circle',
              label: trans('help'),
              target: props.help,
              displayed: !!props.help
            }, {
              name: 'exit-impersonation',
              type: URL_BUTTON,
              icon: 'fa fa-fw fa-mask',
              label: trans('exit', {}, 'actions'),
              displayed: props.impersonated,
              target: url(['claro_index', {_switch: '_exit'}])+'#'+location.pathname
            }, {
              name: 'logout',
              type: URL_BUTTON,
              icon: 'fa fa-fw fa-power-off',
              label: trans('logout'),
              target: ['claro_security_logout']
            }
          ])
        }}
      >
        <UserAvatar user={props.currentUser} noStatusTooltip={true} size={props.size || 'xs'} />
      </Button>
    </div>
  )
}

ContextUser.propTypes = {
  path: T.string.isRequired,
  currentUser: T.shape(
    UserTypes.propTypes
  ),
  help: T.string,
  impersonated: T.bool.isRequired,
  changeStatus: T.func.isRequired
}

export {
  ContextUser
}
