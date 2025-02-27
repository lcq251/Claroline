import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'

import {ResourceCard} from '#/main/evaluation/resource/components/card'
import {MODAL_RESOURCE_EVALUATIONS} from '#/main/evaluation/modals/resource-evaluations'
import {selectors} from '#/main/evaluation/resource/evaluation/store'

import {PageContent, PageSection} from '#/main/app/page'
import {EvaluationList} from '#/main/evaluation/components/list'

const ResourceEvaluationList = (props) =>
  <PageContent className="d-flex">
    <PageSection size="full" className="d-flex flex-fill">
      <EvaluationList
        className="mb-5"
        name={selectors.STORE_NAME}
        url={['apiv2_resource_evaluation_list', {nodeId: props.nodeId}]}
        primaryAction={(row) => ({
          name: 'about',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-circle-info',
          label: trans('show-info', {}, 'actions'),
          modal: [MODAL_RESOURCE_EVALUATIONS, {
            userEvaluation: row
          }]
        })}
        card={ResourceCard}
      />
    </PageSection>
  </PageContent>

ResourceEvaluationList.propTypes = {
  nodeId: T.string.isRequired
}

export {
  ResourceEvaluationList
}
