import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {UserCard} from '#/main/community/user/components/card'
import {route} from '#/main/community//user/routing'

const RegistrationUsers = (props) =>
  <>
    <ListData
      delete={props.unregisterUrl ? {
        url: props.unregisterUrl,
        label: trans('unregister', {}, 'actions'),
        displayed: (row) => hasPermission('administrate', row)
      } : undefined}
      primaryAction={(row) => ({
        type: LINK_BUTTON,
        label: trans('show_profile', {}, 'actions'),
        target: route(row.user)
      })}
      definition={[
        {
          name: 'user',
          type: 'user',
          label: trans('user'),
          displayed: true
        }, {
          name: 'date',
          type: 'date',
          label: trans('registration_date', {}, 'cursus'),
          options: {time: true},
          displayed: true
        }, {
          name: 'userDisabled',
          label: trans('user_disabled', {}, 'community'),
          type: 'boolean',
          displayable: false,
          sortable: false,
          filterable: true
        }
      ].concat(props.customDefinition)}
      actions={props.actions}
      card={(cardProps) => <UserCard {...cardProps} data={cardProps.data.user} />}

      {...omit(props, 'path', 'url', 'autoload', 'customDefinition', 'customActions', 'unregisterUrl')}

      name={props.name}
      fetch={{
        url: props.url,
        autoload: props.autoload
      }}
    />

    {props.add &&
      <Button
        className="w-100 mb-3"
        variant="btn"
        primary={true}
        size="lg"
        {...props.add}
      />
    }
  </>

RegistrationUsers.propTypes = {
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]).isRequired,
  unregisterUrl: T.oneOfType([T.string, T.array]).isRequired,
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  })),
  actions: T.func,
  add: T.shape({
    // action types
  })
}

RegistrationUsers.defaultProps = {
  autoload: true,
  customDefinition: []
}

export {
  RegistrationUsers
}
