import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ListData, actions as listActions} from '#/main/app/content/list'

import {MODAL_TOKEN_FORM} from '#/main/authentication/token/modals/form'

const TokenList = (props) => {
  const dispatch = useDispatch()

  return (
    <ListData
      {...omit(props, 'autoload', 'url', 'definition')}

      fetch={{
        url: props.url,
        autoload: props.autoload
      }}
      delete={{
        url: ['apiv2_apitoken_delete'],
        disabled: (rows) => -1 === rows.findIndex(row => hasPermission('delete', row) && !get(rows[0], 'restrictions.locked', false))
      }}
      definition={[
        {
          name: 'token',
          label: trans('token', {}, 'security'),
          type: 'string',
          primary: true,
          displayed: true
        }, {
          name: 'description',
          label: trans('description'),
          type: 'string',
          displayed: true,
          options: {
            long: true
          }
        }, {
          name: 'restrictions.locked',
          alias: 'locked',
          label: trans('locked'),
          type: 'boolean'
        }
      ].concat(props.definition)}
      actions={(rows) => [
        {
          name: 'edit',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-pencil',
          label: trans('edit', {}, 'actions'),
          modal: [MODAL_TOKEN_FORM, {
            token: rows[0],
            userDisabled: true,
            onSave: () => dispatch(listActions.invalidateData(props.name))
          }],
          disabled: !rows[0] || !hasPermission('edit', rows[0]) || get(rows[0], 'restrictions.locked', false),
          scope: ['object'],
          group: trans('management')
        }
      ]}
    />
  )
}

TokenList.propTypes = {
  className: T.string,
  flush: T.bool,
  autoload: T.bool,
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]),
  definition: T.array,
  actions: T.func
}

TokenList.defaultProps = {
  url: ['apiv2_apitoken_list'],
  autoload: true,
  definition: []
}

export {
  TokenList
}
