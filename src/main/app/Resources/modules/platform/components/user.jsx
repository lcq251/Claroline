import React, {useCallback} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {url} from '#/main/app/api'
import {Button} from '#/main/app/action'
import {CALLBACK_BUTTON, LINK_BUTTON, MENU_BUTTON, URL_BUTTON} from '#/main/app/buttons'

import {UserAvatar} from '#/main/app/user/components/avatar'
import {constants as userConst} from '#/main/app/user/constants'
import {displayUsername} from '#/main/community/utils'
import {selectors} from '#/main/app/context'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {actions} from '#/main/app/platform/store'

const ContextUser = (props) => {
  const dispatch = useDispatch()

  const currentUser = useSelector(securitySelectors.currentUser)
  const impersonated = useSelector(securitySelectors.isImpersonated)
  const path = useSelector(selectors.path)

  const changeStatus = useCallback((status) => {
    dispatch(actions.changeStatus(currentUser, status))
  }, [currentUser.id])

  return (
      <Button
        type={MENU_BUTTON}
        label={trans(impersonated ? 'impersonated_account' : 'my_account', {name: displayUsername(currentUser)})}
        tooltip="right"
        className={classes('d-flex flex-row p-0 focus-ring rounded-circle', props.className)}
        menu={{
          items: [].concat(Object.keys(userConst.USER_STATUSES).map((status) => ({
            name: status,
            type: CALLBACK_BUTTON,
            callback: () => changeStatus(status),
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
              target: path+'/profile'
            }, {
              name: 'parameters',
              type: LINK_BUTTON,
              icon: 'fa fa-fw fa-sliders',
              label: trans('parameters'),
              target: '/account'
            }, {
              name: 'exit-impersonation',
              type: URL_BUTTON,
              icon: 'fa fa-fw fa-mask',
              label: trans('exit', {}, 'actions'),
              displayed: !!impersonated,
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
        <UserAvatar user={currentUser} noStatusTooltip={true} size="sm" />
      </Button>
  )
}

ContextUser.propTypes = {
  className: T.string
}

export {
  ContextUser
}
