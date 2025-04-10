import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {ListData} from '#/main/app/content/list/containers/data'
import {UserAvatar} from '#/main/app/user/components/avatar'
import {route} from '#/main/community/user/routing'
import {displayUsername} from '#/main/community/utils'

const LogFunctionalList = (props) =>
  <ListData
    {...omit(props, 'url', 'name', 'customDefinition')}

    name={props.name}
    fetch={{
      url: props.url,
      autoload: true
    }}

    definition={[
      {
        name: 'action',
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
        name: 'doer',
        type: 'user',
        label: trans('user'),
        displayed: false,
        displayable: false,
        sortable: false
      }
    ].concat(props.customDefinition)}
    selectable={false}
  />

LogFunctionalList.propTypes = {
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]).isRequired,
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  }))
}

LogFunctionalList.defaultProps = {
  customDefinition: []
}

export {
  LogFunctionalList
}
