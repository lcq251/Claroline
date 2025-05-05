import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {LinkButton} from '#/main/app/buttons'

import {Step as StepTypes} from '#/main/evaluation/sequence/prop-types'
import {selectors} from '#/main/evaluation/sequence/store'

const PlayerNext = ({path, next, className}) => {
  const nextNumbering = useSelector((state) => {
    if (!next) {
      return null
    }

    return selectors.stepNumbering(state, next)
  })

  return (
    <LinkButton
      className={classes('btn btn-primary w-100 py-3 mt-auto', className)}
      size="lg"
      target={classes({
        [`${path}/play/end`]: !next,
        [`${path}/play/${next && next.slug}`]: !!next
      })}
      exact={true}
    >
      <div className="content-lg px-4 text-truncate" role="presentation">
        {next &&
          <span className="fa fa-fw fa-arrow-down icon-with-text-right" aria-hidden={true} />
        }

        {!next ?
          trans('finish_sequence', {}, 'actions') :
          (nextNumbering ?
            nextNumbering + ' ' + next.title :
            next.title
          )
        }
      </div>
    </LinkButton>
  )
}

PlayerNext.propTypes = {
  className: T.string,
  path: T.string.isRequired,
  next: T.shape(
    StepTypes.propTypes
  )
}

export {
  PlayerNext
}