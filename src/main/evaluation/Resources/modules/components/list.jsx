import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {ListData} from '#/main/app/content/list'

import {constants} from '#/main/evaluation/constants'
import {EvaluationStatus} from '#/main/evaluation/components/status'
import {EvaluationUserCard} from '#/main/evaluation/components/card'
import {TooltipOverlay} from '#/main/app/overlays/tooltip/components/overlay'
import {EvaluationScore} from '#/main/evaluation/components/score'

const EvaluationList = (props) => {
  return (
    <ListData
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
          displayed: true,
          primary: true
        }, {
          name: 'startedAt',
          label: trans('start_date'),
          type: 'date',
          options: {time: true}
        }, {
          name: 'endedAt',
          label: trans('end_date'),
          type: 'date',
          options: {time: true}
        }, {
          name: 'lastActivityAt',
          label: trans('last_activity'),
          type: 'date',
          options: {time: true},
          displayed: true
        }, {
          name: 'duration',
          type: 'time',
          label: trans('duration'),
          displayed: false,
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
          name: 'displayScore',
          type: 'score',
          alias: 'score',
          label: trans('score'),
          displayed: props.hasScore,
          displayable: props.hasScore,
          placeholder: props.hasScore && (
            <div className="d-inline-flex gap-2 flex-row align-items-center" role="presentation">
              <TooltipOverlay
                id="score-help"
                tip={trans('Le score est calculé une fois que l\'utilisateur a terminé toutes les activités à faire.', {}, 'evaluation')}
                position="left"
              >
                <span className="fa fa-fw fa-info-circle cursor-help fs-sm text-body-tertiary" />
              </TooltipOverlay>

              <EvaluationScore scoreMax={props.totalScore} />
            </div>
          ),
          filterable: false
        }, {
          name: 'user.disabled',
          label: trans('user_disabled', {}, 'community'),
          type: 'boolean',
          displayable: false,
          sortable: false,
          filterable: true
        }
      ].concat(props.customDefinition)}
      actions={(rows) => [
        /*{
          name: 'send-message',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-envelope',
          label: trans('send-message', {}, 'actions'),
          scope: ['object', 'collection'],
          modal: [MODAL_MESSAGE, {
            receivers: {users: rows.map((row => row.user))}
          }]
        }*/
      ]}
      card={EvaluationUserCard}

      {...omit(props, 'path', 'url', 'autoload', 'customDefinition', 'customActions')}

      name={props.name}
      fetch={{
        url: props.url,
        autoload: props.autoload
      }}
    />
  )
}

EvaluationList.propTypes = {
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]).isRequired,
  autoload: T.bool,
  customDefinition: T.arrayOf(T.shape({
    // data list prop types
  })),
  hasScore: T.bool,
  totalScore: T.number
}

EvaluationList.defaultProps = {
  autoload: true,
  customDefinition: []
}

export {
  EvaluationList
}
