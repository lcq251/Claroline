import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {Button} from '#/main/app/action'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ContentTitle} from '#/main/app/content/components/title'
import {EditorPage} from '#/main/app/editor'

import changePasswordAction from '#/main/authentication//actions/user/password-change'
import {MODAL_TOKEN_PARAMETERS} from '#/main/authentication/token/modals/parameters'
import {TokenList} from '#/main/authentication/token/components/list'
import {LogSecurityList} from '#/main/log/components/security-list'

import {selectors as editorSelectors} from '#/main/community/user/editor'
import {selectors} from '#/main/authentication/account/authentication/store'
import {MODAL_IP_PARAMETERS} from '#/main/authentication/ip/modals/parameters'
import {IpList} from '#/main/authentication/ip/components/list'

const AccountAuthentication = props => {
  const currentUser = useSelector(editorSelectors.user)

  return (
    <EditorPage
      title={trans('authentication', {}, 'tools')}
      help={trans('authentication_help', {}, 'security')}
    >
      <Button
        className="btn btn-primary me-auto"
        {...changePasswordAction([currentUser])}
        icon={undefined}
      />

      <hr className="my-5" aria-hidden="true" />
      <ContentTitle
        displayLevel={5}
        title={trans('tokens', {}, 'security')}
      />
      <p className="text-body-secondary">
        {trans('tokens_help', {}, 'security')}
      </p>

      <TokenList
        name={selectors.STORE_NAME+'.tokens'}
        autoload={!isEmpty(currentUser)}
        url={['apiv2_apitoken_list_user', {userId: currentUser.id}]}
        actions={(rows) => [
          {
            name: 'edit',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-pencil',
            label: trans('edit', {}, 'actions'),
            modal: [MODAL_TOKEN_PARAMETERS, {
              token: rows[0],
              userDisabled: true,
              onSave: () => props.invalidateList(selectors.STORE_NAME+'.tokens')
            }],
            disabled: !rows[0] || !hasPermission('edit', rows[0]) || get(rows[0], 'restrictions.locked', false),
            scope: ['object'],
            group: trans('management')
          }
        ]}
        addAction={{
          name: 'add-token',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-plus',
          label: trans('add_token', {}, 'security'),
          tooltip: 'bottom',
          primary: true,
          modal: [MODAL_TOKEN_PARAMETERS, {
            userDisabled: true,
            token: {
              user: currentUser
            },
            onSave: () => props.invalidateList(selectors.STORE_NAME+'.tokens')
          }]
        }}
      />

      <hr className="my-5" aria-hidden="true" />
      <ContentTitle
        displayLevel={5}
        title={trans('ips', {}, 'security')}
      />
      <p className="text-body-secondary">
        {trans('ips_help', {}, 'security')}
      </p>

      <IpList
        name={selectors.STORE_NAME+'.ips'}
        url={['apiv2_ip_user_list_user', {userId: currentUser.id}]}
        autoload={!isEmpty(currentUser)}
        addAction={{
          name: 'add-ip',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-plus',
          tooltip: 'bottom',
          label: trans('add_ip', {}, 'security'),
          primary: true,
          modal: [MODAL_IP_PARAMETERS, {
            userDisabled: true,
            ip: {
              user: currentUser
            },
            onSave: () => props.invalidateList(selectors.STORE_NAME+'.ips')
          }]
        }}
      />

      <hr className="my-5" aria-hidden="true" />
      <ContentTitle
        displayLevel={5}
        title={trans('logs', {}, 'security')}
      />
      <p className="text-body-secondary">
        {trans('logs_help', {}, 'security')}
      </p>

      <LogSecurityList
        className="mb-5"
        name={selectors.STORE_NAME+'.logs'}
        url={['apiv2_logs_security_list_user', {userId: currentUser.id}]}
        autoload={!isEmpty(currentUser)}
      />
    </EditorPage>
  )
}

AccountAuthentication.propTypes = {
  invalidateList: T.func.isRequired
}

export {
  AccountAuthentication
}
