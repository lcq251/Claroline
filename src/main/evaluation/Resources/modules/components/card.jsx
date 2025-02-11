import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {DataCard} from '#/main/app/data/components/card'

import {ProgressBar} from '#/main/app/components/progress-bar'
import {Datetime} from '#/main/app/components/date'
import {constants} from '#/main/evaluation/constants'
import {displayScore} from '#/main/evaluation/data/types/score/utils'
import {User} from '#/main/community/user/prop-types'

const EvaluationUserCard = (props) => {
  return (
    <DataCard />
  )
}

EvaluationUserCard.propTypes = {
  
}

const EvaluationContentCard = (props) => {
  const progression = get(props.data, 'progression', 0)
  const status = get(props.data, 'status', constants.EVALUATION_STATUS_UNKNOWN)

  let statusText = constants.EVALUATION_STATUSES_SHORT[status]
  if (constants.EVALUATION_TERMINATED_STATUSES.includes(status) && !isEmpty(props.data.displayScore)) {
    statusText = displayScore(props.data.displayScore.total, props.data.displayScore.current)
  }

  return (
    <DataCard
      {...props}
      status={{
        variant: constants.EVALUATION_STATUS_COLOR[status],
        text: statusText
      }}
      poster={get(props.content, 'thumbnail')}
      name={get(props.content, 'name')}
      title={get(props.content, 'name')}
    >
      <div className={classes('d-flex gap-2', {
        'flex-column mt-3': 'col' === props.orientation,
        'flex-row align-items-center': 'row' === props.orientation
      })} role="presentation">
        <ProgressBar
          className="flex-fill"
          size="xs"
          value={progression}
          variant={constants.EVALUATION_STATUS_COLOR[status]}
        />

        <div className=" fs-sm text-body-secondary" role="presentation">
          <b className="text-uppercase text-nowrap d-block">
            {[constants.EVALUATION_STATUS_PASSED, constants.EVALUATION_STATUS_FAILED].includes(status) ?
              constants.EVALUATION_STATUSES_SHORT[status] :
              trans('completion', {current: progression}, 'evaluation')
            }
          </b>

          {'row' !== props.orientation &&
            <>
              {props.data.date ?
                (<>{trans('last_activity_at')} <Datetime value={props.data.date} long={true} /></>)
                : trans('no_user_activity', {}, 'evaluation')
              }
            </>
          }
        </div>
      </div>
    </DataCard>
  )
}

EvaluationContentCard.propTypes = {
  orientation: T.string,
  size: T.string,
  content: T.shape({
    name: T.string.isRequired,
    thumbnail: T.string
  }),
  data: T.shape({
    id: T.number,
    date: T.string,
    status: T.string,
    duration: T.number,
    displayScore: T.shape({
      current: T.number,
      total: T.number.isRequired
    }),
    progression: T.number
  })
}

export {
  EvaluationUserCard,
  EvaluationContentCard
}
