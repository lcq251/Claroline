import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {EmptyState} from '#/main/app/components/empty-state'

import {ResourceAttempt, ResourceEvaluation} from '#/main/evaluation/resource/prop-types'
import {EvaluationListItem} from '#/main/evaluation/components/list-item'

const UserProgressionOverview = (props) => {
  if (isEmpty(props.progression)) {
    return (
      <EmptyState
        title={trans('L\'utilisateur n\'a pas commencé l\'activité pour le moment')}
      />
    )
  }

  return (
    <ul className="list-unstyled mb-0">
      {props.progression.map((resourceAttempt, index) =>
        <li key={get(resourceAttempt, 'id')} className={classes(0 !== index && 'border-top')}>
          <EvaluationListItem
            title={trans('attempt', {number: index + 1}, 'evaluation')}
            evaluation={resourceAttempt}
          />
        </li>
      )}
    </ul>
  )
}

UserProgressionOverview.propTypes = {
  evaluation: T.shape(ResourceEvaluation.propTypes),
  progression: T.arrayOf(T.shape(
    ResourceAttempt.propTypes
  ))
}

export {
  UserProgressionOverview
}
