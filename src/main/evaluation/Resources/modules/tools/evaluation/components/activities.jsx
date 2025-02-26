import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {ToolPage} from '#/main/core/tool'
import {PageListSection} from '#/main/app/page'
import {constants as listConst} from '#/main/app/content/list/constants'

import {ResourceList} from '#/main/core/resource/components/list'
import {selectors} from '#/main/evaluation/tools/evaluation/store'

const EvaluationActivities = (props) =>
  <ToolPage title={trans('activities')}>
    <PageListSection
      title={trans('activities')}
    >
      <ResourceList
        className="mb-5"
        flush={true}
        name={selectors.STORE_NAME+'.requiredResources'}
        url={['apiv2_workspace_required_resource_list', {workspace: props.contextId}]}
        actions={undefined}
        display={{
          current: listConst.DISPLAY_LIST
        }}
      />
    </PageListSection>
  </ToolPage>

EvaluationActivities.propTypes = {
  contextId: T.string.isRequired
}

export {
  EvaluationActivities
}
