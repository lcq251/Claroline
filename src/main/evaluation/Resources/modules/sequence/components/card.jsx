import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {Badge} from '#/main/app/components/badge'
import {DataCard} from '#/main/app/data/components/card'

import {Sequence as SequenceTypes, SequenceEvaluation as SequenceEvaluationTypes} from '#/main/evaluation/sequence/prop-types'
import {EvaluationContentCard} from '#/main/evaluation/components/card'
import isEmpty from 'lodash/isEmpty'
import {URL_BUTTON} from '#/main/app/buttons'
import {route} from '#/main/evaluation/sequence/routing'

const EvaluationSequenceCard = (props) =>
  <EvaluationContentCard
    {...props}
    primaryAction={!isEmpty(props.primaryAction) ? props.primaryAction : {
      type: URL_BUTTON,
      target: '#'+route(props.data.sequence)
    }}
    content={get(props.data, 'sequence')}
  />

EvaluationSequenceCard.propTypes = {
  data: T.shape(
    SequenceEvaluationTypes.propTypes
  ),
  primaryAction: T.shape({
    // action types
  })
}

const SequenceCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail}
    icon={!props.data.thumbnail ? <>{props.data.name.charAt(0)}</> : null}
    title={props.data.name}
    meta={
      <>
        {get(props.data, 'evaluation.estimatedDuration') &&
          <Badge variant="secondary" subtle={true}>
            <span className="fa far fa-clock me-1" />
            {get(props.data, 'evaluation.estimatedDuration') + ' ' + trans('minutes_short')}
          </Badge>
        }
      </>
    }
    contentText={get(props.data, 'meta.description') || <em className="text-body-tertiary">{trans('no_description')}</em>}
  />

SequenceCard.propTypes = {
  className: T.string,
  data: T.shape(
    SequenceTypes.propTypes
  ).isRequired
}

export {
  SequenceCard,
  EvaluationSequenceCard
}
