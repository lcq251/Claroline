import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {ContextPage} from '#/main/app/context/components/page'
import {UserAvatar} from '#/main/app/user/components/avatar'
import {PageHeading} from '#/main/app/page/components/heading'
import {PageContent} from '#/main/app/page'

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
    >
      <PageContent>
        <PageHeading
          size="md"
          poster={props.currentUser.poster}
          title={props.currentUser.name}
          icon={<UserAvatar user={props.currentUser} size="lg" />}
          primaryAction="edit"
          actions={[
            {
              name: 'edit',
              type: LINK_BUTTON,
              icon: 'fa fa-fw fa-pencil',
              label: trans('edit', {}, 'actions'),
              target: `${props.path}/profile/edit`,
              primary: true
            }
          ]}
        />

      </PageContent>
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
