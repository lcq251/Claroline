import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {Toolbar} from '#/main/app/action'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {EditorPage} from '#/main/app/editor'

import {MODAL_TOKEN_FORM} from '#/main/authentication/token/modals/form'
import {TokenList} from '#/main/authentication/token/components/list'
import {MODAL_IP_FORM} from '#/main/authentication/ip/modals/form'
import {IpList} from '#/main/authentication/ip/components/list'
import {LogSecurityList} from '#/main/log/components/security-list'

import {MODAL_USER_PASSWORD} from '#/main/authentication/account/authentication/modals/password'
import {selectors as editorSelectors} from '#/main/community/user/editor'
import {selectors} from '#/main/authentication/account/authentication/store'
import {FormPrimarySection} from '#/main/app/content/form/components/sections'

const AccountAuthentication = props => {
  const currentUser = useSelector(editorSelectors.user)

  return (
    <EditorPage
      title={trans('authentication', {}, 'tools')}
      help={trans('authentication_help', {}, 'security')}
    >
      <FormPrimarySection>
        <div role="presentation" className="mb-n3">
          {trans('account_name', {}, 'security')} <b className="fw-bold">{currentUser.username}</b>
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
      </FormPrimarySection>

      <hr aria-hidden="true" />
      <FormPrimarySection
        title={trans('tokens', {}, 'security')}
        description={trans('tokens_help', {}, 'security')}
        actions={[
          {
            name: 'add-token',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-plus',
            label: trans('add_token', {}, 'security'),
            primary: true,
            modal: [MODAL_TOKEN_FORM, {
              userDisabled: true,
              token: {
                user: currentUser
              },
              onSave: () => props.invalidateList(selectors.STORE_NAME+'.tokens')
            }]
          }
        ]}
      >
        <TokenList
          name={selectors.STORE_NAME+'.tokens'}
          autoload={!isEmpty(currentUser)}
          url={['apiv2_apitoken_list_user', {userId: currentUser.id}]}
        />
      </FormPrimarySection>

      <hr aria-hidden="true" />

      <FormPrimarySection
        title={trans('ips', {}, 'security')}
        description={trans('ips_help', {}, 'security')}
        actions={[
          {
            name: 'add-ip',
            type: MODAL_BUTTON,
            icon: 'fa fa-fw fa-plus',
            label: trans('add_ip', {}, 'security'),
            primary: true,
            modal: [MODAL_IP_FORM, {
              userDisabled: true,
              ip: {
                user: currentUser
              },
              onSave: () => props.invalidateList(selectors.STORE_NAME+'.ips')
            }]
          }
        ]}
      >
        <IpList
          name={selectors.STORE_NAME+'.ips'}
          url={['apiv2_ip_user_list_user', {userId: currentUser.id}]}
          autoload={!isEmpty(currentUser)}
        />
      </FormPrimarySection>

      <hr aria-hidden="true" />

      <FormPrimarySection
        title={trans('logs', {}, 'security')}
        description={trans('logs_help', {}, 'security')}
      >
        <LogSecurityList
          name={selectors.STORE_NAME+'.logs'}
          url={['apiv2_logs_security_list_user', {userId: currentUser.id}]}
          autoload={!isEmpty(currentUser)}
        />
      </FormPrimarySection>
    </EditorPage>
  )
}

AccountAuthentication.propTypes = {
  invalidateList: T.func.isRequired
}

export {
  AccountAuthentication
}
