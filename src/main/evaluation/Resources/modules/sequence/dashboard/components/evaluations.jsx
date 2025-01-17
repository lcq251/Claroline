import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {MODAL_MESSAGE} from '#/plugin/message/modals/message'
import {PageListSection, PageSection} from '#/main/app/page'
import {DashboardPage} from '#/main/app/dashboard'

import {ResourceCard} from '#/main/evaluation/resource/components/card'
import {MODAL_RESOURCE_EVALUATIONS} from '#/main/evaluation/modals/resource-evaluations'
import {selectors as sequenceSelectors} from '#/main/evaluation/sequence/store'

import {selectors} from '#/main/evaluation/sequence/dashboard/store'
import {constants} from '#/main/evaluation/constants'
import {EvaluationStatus} from '#/main/evaluation/components/status'

const SequenceDashboardEvaluations = () => {
  const sequenceId = useSelector(sequenceSelectors.id)

  return (
    <DashboardPage>
      <PageSection size="full" className="d-flex flex-fill">
        <ListData
          className="mb-5"
          name={selectors.STORE_NAME+'.evaluations'}
          fetch={{
            url: ['apiv2_sequence_evaluation_list', {sequenceId: sequenceId}],
            autoload: true
          }}
          definition={[
            {
              name: 'status',
              type: 'choice',
              label: trans('status'),
              options: {
                choices: constants.EVALUATION_STATUSES_SHORT
              },
              displayed: true,
              render: (row) => <EvaluationStatus status={row.status} />
            }, {
              name: 'user',
              type: 'user',
              label: trans('user'),
              displayed: true
            }, {
              name: 'date',
              label: trans('last_activity'),
              type: 'date',
              options: {time: true},
              displayed: true,
              primary: true
            }, {
              name: 'duration',
              type: 'time',
              label: trans('duration'),
              displayed: true,
              filterable: false
            }, {
              name: 'progression',
              label: trans('progression'),
              type: 'progression',
              displayed: true,
              filterable: false,
              options: {
                type: 'learning'
              }
            }, {
              name: 'score',
              type: 'score',
              label: trans('score'),
              calculated: (row) => {
                if (row.scoreMax) {
                  return {
                    current: row.score,
                    total: row.scoreMax,
                    display: 100
                  }
                }

                return null
              },
              displayed: true,
              filterable: false
            }, {
              name: 'user.disabled',
              label: trans('user_disabled', {}, 'community'),
              type: 'boolean',
              displayable: false,
              sortable: false,
              filterable: true
            }
          ]}
          actions={(rows) => [
            {
              name: 'about',
              type: MODAL_BUTTON,
              icon: 'fa fa-fw fa-circle-info',
              label: trans('show-info', {}, 'actions'),
              modal: [MODAL_RESOURCE_EVALUATIONS, {
                userEvaluation: rows[0]
              }],
              scope: ['object']
            }, {
              type: MODAL_BUTTON,
              icon: 'fa fa-fw fa-envelope',
              label: trans('send-message', {}, 'actions'),
              scope: ['object', 'collection'],
              modal: [MODAL_MESSAGE, {
                receivers: {users: rows.map((row => row.user))}
              }]
            }
          ]}
          card={ResourceCard}
        />
      </PageSection>
    </DashboardPage>
  )
}

export {
  SequenceDashboardEvaluations
}
