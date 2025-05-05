import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {getActions} from '#/main/community/team/utils'
import {Team as TeamTypes} from '#/main/community/team/prop-types'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {PageContent} from '#/main/app/page'

const Team = (props) =>
  <ToolPage
    title={trans('team_name', {name: get(props.team, 'name', trans('loading'))}, 'community')}
    description={get(props.team, 'meta.description')}
  >
    {isEmpty(props.team) &&
      <PageContent className="placeholder-glow">
        <PageHeadingSkeleton
          description={true}
        />
      </PageContent>
    }

    {!isEmpty(props.team) &&
      <PageContent poster={get(props.team, 'poster')}>
        <PageHeading
          title={get(props.team, 'name', trans('loading'))}
          description={get(props.team, 'meta.description')}
          primaryAction="edit"
          actions={!isEmpty(props.team) ? getActions([props.team], {
            add: () => props.reload(props.team.id),
            update: () => props.reload(props.team.id),
            delete: () => props.reload(props.team.id)
          }, props.path, props.currentUser) : []}
        />

        {props.children}
      </PageContent>
    }
  </ToolPage>

Team.propTypes = {
  path: T.string,
  team: T.shape(
    TeamTypes.propTypes
  ),
  currentUser: T.object,
  children: T.any,
  reload: T.func
}

const TeamPage = connect(
  (state) => ({
    currentUser: securitySelectors.currentUser(state)
  })
)(Team)

export {
  TeamPage
}
