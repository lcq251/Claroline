import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {Toolbar} from '#/main/app/action'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ContentTitle} from '#/main/app/content/components/title'
import {EditorPage} from '#/main/app/editor'

import {MODAL_TOKEN_PARAMETERS} from '#/main/authentication/token/modals/parameters'
import {TokenList} from '#/main/authentication/token/components/list'
import {MODAL_IP_PARAMETERS} from '#/main/authentication/ip/modals/parameters'
import {IpList} from '#/main/authentication/ip/components/list'
import {LogSecurityList} from '#/main/log/components/security-list'

import {MODAL_USER_PASSWORD} from '#/main/authentication/account/authentication/modals/password'
import {selectors as editorSelectors} from '#/main/community/user/editor'
import {selectors} from '#/main/authentication/account/authentication/store'

const AccountAuthentication = props => {
  const currentUser = useSelector(editorSelectors.user)

  return (
    <EditorPage
      title={trans('authentication', {}, 'tools')}
      help={trans('authentication_help', {}, 'security')}
    >
      <div role="presentation" className="mb-3">
        Nom du compte : <b className="fw-bold">{currentUser.username}</b>
      </div>
      <Toolbar
        className="me-auto d-flex gap-1"
        buttonName="btn"
        primaryName="btn-primary"
        defaultName="btn-link"
        actions={[
          {
            name: 'change-password',
            type: MODAL_BUTTON,
            label: trans('change_password', {}, 'actions'),
            modal: [MODAL_USER_PASSWORD, {
              user: currentUser
            }],
            primary: true
          }, {
            name: 'reset-password',
            type: CALLBACK_BUTTON,
            label: trans('forgot_password'),
            callback: () => true
          }
        ]}
      />

      <hr className="my-5" aria-hidden="true" />
      <ContentTitle
        className="mb-2"
        level={3}
        displayLevel={5}
        title={trans('tokens', {}, 'security')}
      />
      <p className="text-body-secondary mb-5">
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
        className="mb-2"
        level={3}
        displayLevel={5}
        title={trans('ips', {}, 'security')}
      />
      <p className="text-body-secondary mb-5">
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
        className="mb-2"
        level={3}
        displayLevel={5}
        title={trans('logs', {}, 'security')}
      />
      <p className="text-body-secondary mb-5">
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
