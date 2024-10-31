import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {ListData} from '#/main/app/content/list/containers/data'
import {UserAvatar} from '#/main/app/user/components/avatar'
import {route} from '#/main/community/user/routing'
import {displayUsername} from '#/main/community/utils'

const LogSecurityList = (props) =>
  <ListData
    {...omit(props, 'autoload', 'url', 'name', 'customDefinition')}

    name={props.name}
    fetch={{
      url: props.url,
      autoload: props.autoload
    }}

    definition={[
      {
        name: 'details',
        type: 'user',
        label: trans('action'),
        displayed: true,
        sortable: false,
        primary: true,
        filterable: false,
        render: (row) => (
          <div className="d-flex flex-direction-row gap-3 align-items-center fw-normal">
            <UserAvatar user={row.doer} size="xs" />
            <div
              role="presentation"
              dangerouslySetInnerHTML={{ __html: `<a href="${route(row.doer)}">${displayUsername(row.doer)}</a> ` + row.details }}
            />
          </div>
        )
      }, {
        name: 'date',
        label: trans('date'),
        type: 'date',
        options: {time: true},
        displayed: true
      }, {
        name: 'event',
        type: 'translation',
        label: trans('event'),
        displayed: false,
        options: {
          domain: 'log'
        }
      }, {
        name: 'doer',
        type: 'user',
        label: trans('user'),
        displayed: false,
        displayable: false
      }, {
        name: 'doer_ip',
        label: trans('ip_address'),
        type: 'ip',
        displayed: false
      }
    ].concat(props.customDefinition)}
    selectable={false}
  />

LogSecurityList.propTypes = {
  className: T.string,
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]).isRequired,
  autoload: T.bool,
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  }))
}

LogSecurityList.defaultProps = {
  autoload: true,
  customDefinition: []
}

export {
  LogSecurityList
}
