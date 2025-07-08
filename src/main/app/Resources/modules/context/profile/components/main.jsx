import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {ContextPage} from '#/main/app/context/components/page'
import {UserProfile} from '#/main/community/user/components/profile'

const ContextProfile = (props) => {
  return (
    <ContextPage
      title={trans('my_profile')}
      name={trans('my_profile')}
      breadcrumb={[
        {
          type: LINK_BUTTON,
          label: trans('my_profile'),
          target: `${props.path}/profile`
        }
      ]}
      menu={{
        actions: [
          {
            name: 'parameters',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-sliders',
            label: trans('parameters'),
            target: `/account`,
            tooltip: 'bottom'
          }
        ]
      }}
    >
      <UserProfile
        path={props.path+'/profile'}
        user={props.currentUser}
      />
    </ContextPage>
  )
}

ContextProfile.propTypes = {
  path: T.string.isRequired,
  currentUser: T.shape({
    username: T.string.isRequired
  }),
  reset: T.func.isRequired
}

export {
  ContextProfile
}
