import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {number} from '#/main/app/intl'

const EvaluationScore = ({
  scoreMax,
  display,
  size,
  className,
  score = null,
  condensed = true
}) => {
  let userScore = score
  if (null !== userScore && display) {
    userScore = (userScore / scoreMax) * display
  }

  /*if (condensed) {
    return (
      <div className={classes('score-box', className, size ? 'score-box-'+size : null)}>
        <span className="user-score" role="presentation">{userScore || 0 === userScore ? number(userScore) : '-'}</span>
        <span className="visually-hidden" role="presentation">/</span>

        {display ?
          <span className="max-score" role="presentation">{number(display)}</span>
          :
          <span className="max-score" role="presentation">{scoreMax || 0 === scoreMax ? number(scoreMax) : '-'}</span>
        }
      </div>
    )
  }*/

  return (
    <div className={classes('d-inline-flex flex-row text-center py-1', className, size && `fs-${size}`)} style={{lineHeight: 1}}>
      <span className="user-score fw-bold" role="presentation">{userScore || 0 === userScore ? number(userScore) : '-'}</span>
      <span aria-hidden={true} className="mx-2 vr" />
      <span className="max-score fw-normal" role="presentation">{scoreMax || 0 === scoreMax ? number(scoreMax) : '-'}</span>
    </div>
  )
}

EvaluationScore.propTypes = {
  style: T.object,
  score: T.number,
  scoreMax: T.number.isRequired,
  display: T.number,
  size: T.oneOf(['sm', 'md', 'lg']),
  className: T.string,
  condensed: T.bool
}

export {
  EvaluationScore
}
