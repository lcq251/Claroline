import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {PageListSection} from '#/main/app/page'

import {TeamList as BaseTeamList} from '#/main/community/team/components/list'
import {selectors} from '#/main/community/tools/community/team/store/selectors'

const TeamList = props =>
  <ToolPage
    title={trans('teams', {}, 'community')}
  >
    <PageListSection
      poster={props.poster}
      title={trans('teams', {}, 'community')}
      addAction={{
        name: 'add',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_team', {}, 'actions'),
        target: `${props.path}/teams/new`,
        displayed: props.canCreate
      }}
    >
      <BaseTeamList
        className="mb-5"
        flush={true}
        path={props.path}
        name={selectors.LIST_NAME}
        url={['apiv2_team_workspace_list', {id: props.contextData.id}]}
      />
    </PageListSection>
  </ToolPage>

TeamList.propTypes = {
  path: T.string.isRequired,
  poster: T.string,
  contextData: T.object,
  canCreate: T.bool.isRequired
}

export {
  TeamList
}
