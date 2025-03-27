import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {getActions} from '#/main/community/user/utils'
import {User as UserTypes} from '#/main/community/user/prop-types'
import {UserAvatar} from '#/main/app/user/components/avatar'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {PageContent} from '#/main/app/page'

const User = (props) =>
  <ToolPage
    title={get(props.user, 'name', trans('loading'))}
    description={get(props.group, 'meta.description')}
  >
    {isEmpty(props.user) &&
      <PageContent className="placeholder-glow">
        <PageHeadingSkeleton
          size="md"
          icon={true}
          description={true}
        />
      </PageContent>
    }

    {!isEmpty(props.user) &&
      <PageContent>
        <PageHeading
          size="md"
          poster={get(props.user, 'poster')}
          icon={
            <UserAvatar user={props.user} size="lg" border={true} />
          }
          title={get(props.user, 'name', trans('loading'))}
          primaryAction="send-message"
          actions={getActions([props.user], {
            add: () => props.reload(props.user.id),
            update: () => props.reload(props.user.id),
            delete: () => props.reload(props.user.id)
          }, props.path, props.currentUser)}
        />

        {props.children}
      </PageContent>
    }
  </ToolPage>

User.propTypes = {
  path: T.string,
  user: T.shape(
    UserTypes.propTypes
  ),
  currentUser: T.object,
  children: T.any,
  reload: T.func
}

const UserPage = connect(
  (state) => ({
    currentUser: securitySelectors.currentUser(state)
  })
)(User)

export {
  UserPage
}
