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
import {Alert} from '#/main/app/components/alert'
import {EditorPage} from '#/main/app/editor'

import changePasswordAction from '#/main/authentication//actions/user/password-change'
import {MODAL_TOKEN_PARAMETERS} from '#/main/authentication/token/modals/parameters'
import {TokenList} from '#/main/authentication/token/components/list'
import {LogSecurityList} from '#/main/log/components/security-list'

import {selectors as editorSelectors} from '#/main/community/user/editor'
import {selectors} from '#/main/authentication/account/authentication/store'

const AccountAuthentication = props => {
  const currentUser = useSelector(editorSelectors.user)

  return (
    <EditorPage
      title={trans('authentication', {}, 'tools')}
      help={trans('Lorem ipsum dolor sir amet.')}
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

      <Alert type="info">
        {trans('tokens_info', {}, 'security')}
      </Alert>

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
              onSave: () => props.invalidateList()
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
            onSave: () => props.invalidateList()
          }]
        }}
      />

      <hr className="my-5" aria-hidden="true" />

      <ContentTitle
        displayLevel={5}
        title={trans('logs')}
      />
      <p className="text-body-secondary">
        {trans('Lorem ipsum dolor sit amet.', {}, 'security')}
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
