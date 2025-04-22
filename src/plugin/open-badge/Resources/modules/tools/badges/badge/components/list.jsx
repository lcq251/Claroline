import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'

import {BadgeList as BaseBadgeList}  from '#/plugin/open-badge/badge/components/list'
import {selectors} from '#/plugin/open-badge/tools/badges/store'
import {PageListSection} from '#/main/app/page'
import {MODAL_BADGE_CREATION} from '#/plugin/open-badge/badge/modals/creation'

const BadgeList = props =>
  <ToolPage
    title={trans('all_badges', {}, 'badge')}
  >
    <PageListSection
      poster={props.poster}
      title={trans('all_badges', {}, 'badge')}
      addAction={{
        name: 'add',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_badge', {}, 'actions'),
        target: `${props.path}/new`,
        displayed: props.canEdit,
        primary: true,
        modal: [MODAL_BADGE_CREATION, {
          contextType: props.contextType,
          contextId: props.contextId
        }]
      }}
    >
      <BaseBadgeList
        className="mb-5"
        flush={true}
        path={props.path}
        name={selectors.LIST_NAME}
        url={'workspace' === props.contextType ?
          ['apiv2_badge_workspace_list', {workspace: props.contextId}] :
          ['apiv2_badge_list']
        }
        customDefinition={'workspace' !== props.contextType ? [
          {
            name: 'workspace',
            label: trans('workspace'),
            type: 'workspace',
            displayed: true,
            filterable: true
          }
        ] : []}
      />
    </PageListSection>
  </ToolPage>

BadgeList.propTypes = {
  path: T.string.isRequired,
  poster: T.string,
  canEdit: T.bool.isRequired,
  contextType: T.string.isRequired,
  contextId: T.string
}

export {
  BadgeList
}
