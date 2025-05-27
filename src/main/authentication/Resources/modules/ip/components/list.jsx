import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {actions as listActions} from '#/main/app/content/list/store'

import {MODAL_IP_FORM} from '#/main/authentication/ip/modals/form'

const IpList = (props) => {
  const dispatch = useDispatch()

  return (
    <ListData
      {...omit(props, 'autoload', 'url', 'definition')}

      fetch={{
        url: props.url,
        autoload: props.autoload
      }}
      delete={{
        url: ['apiv2_ip_user_delete'],
        disabled: (rows) => -1 === rows.findIndex(row => !row.restrictions.locked)
      }}
      definition={[
        {
          name: 'ip',
          label: trans('ip_address'),
          type: 'string',
          displayed: true,
          primary: true,
          calculated: (row) => {
            if (Array.isArray(row.ip)) {
              return `[ ${row.ip[0]}, ${row.ip[1]} ]`
            }

            return row.ip
          }
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
          modal: [MODAL_IP_FORM, {
            ip: rows[0],
            userDisabled: true,
            onSave: () => dispatch(listActions.invalidateData(props.name))
          }],
          disabled: rows[0].restrictions.locked,
          scope: ['object'],
          group: trans('management')
        }
      ]}
    />
  )
}

IpList.propTypes = {
  autoload: T.bool,
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]),
  definition: T.array,
  actions: T.func
}

IpList.defaultProps = {
  url: ['apiv2_apitoken_list'],
  autoload: true,
  definition: []
}

export {
  IpList
}
