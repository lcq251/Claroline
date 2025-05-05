import React from 'react'
import {useSelector} from 'react-redux'

import {selectors as securitySelectors} from '#/main/app/security/store'

import {ContentTitle} from '#/main/app/content/components/title'
import {UserAvatar} from '#/main/app/user/components/avatar'

import {constants} from "#/main/app/user/constants"
import {UserStatus} from '#/main/app/user/components/status'
import {PageSection} from '#/main/app/page'
import {DataStack} from '#/main/app/data/components/stack'

const ExampleUsers = () => {
  const currentUser = useSelector(securitySelectors.currentUser)

  return (
    <PageSection size="xl">
      <ContentTitle level={2} title="Avatars" />

      <div className="mb-5 d-flex gap-5 align-items-end">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size =>
          <UserAvatar key={size} user={currentUser} size={size} noStatus={true} />
        )}
      </div>

      <div className="mb-5 d-flex gap-5 align-items-end">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size =>
          <UserAvatar key={size} size={size} noStatus={true} />
        )}
      </div>

      <ContentTitle level={2} title="Avatars with status" />

      <div className="mb-5 d-flex gap-5  align-items-end">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size =>
          <UserAvatar key={size} user={currentUser} size={size} />
        )}
      </div>

      <ContentTitle level={2} title="Status" />
      <div className="mb-5 d-flex gap-3">
        {Object.keys(constants.USER_STATUSES).map(status =>
          <UserStatus key={status} user={{status: status}} variant="text" />
        )}
      </div>

      <div className="mb-5 d-flex gap-3">
        {Object.keys(constants.USER_STATUSES).map(status =>
          <UserStatus key={status} user={{status: status}} variant="badge" />
        )}
      </div>

      <ContentTitle level={2} title="Avatars stacked" />
      <div className="mb-5 d-flex gap-5 align-items-end flex-wrap">
        <DataStack
          objects={[
            {
              name: 'John Doe'
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }
          ]}
          size="xs"
        />

        <DataStack
          objects={[
            {
              name: 'John Doe'
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }
          ]}
          size="sm"
        />

        <DataStack
          objects={[
            {
              name: 'John Doe'
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }
          ]}
          size="md"
        />

        <DataStack
          objects={[
            {
              name: 'John Doe'
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }, {
              name: currentUser.name,
              thumbnail: currentUser.picture
            }
          ]}
          size="lg"
        />
      </div>
    </PageSection>
  )
}

export {
  ExampleUsers
}
