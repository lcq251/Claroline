import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'

import {trans} from '#/main/app/intl'
import {LinkButton} from '#/main/app/buttons'

import {selectors} from '#/main/evaluation/sequence/store'
import {Step as StepTypes} from '#/main/evaluation/sequence/prop-types'

const PlayerPrevious = ({path, previous, className}) => {
  const previousNumbering = useSelector((state) => {
    if (!previous) {
      return null
    }

    return selectors.stepNumbering(state, previous)
  })

  return (
    <LinkButton
      className={classes('btn text-secondary-emphasis bg-secondary-subtle w-100 py-3 focus-ring focus-ring-secondary', className)}
      size="lg"
      target={classes({
        [`${path}`]: !previous,
        [`${path}/play/${previous && previous.slug}`]: !!previous
      })}
      exact={true}
    >
      <div className="content-lg px-4 text-truncate" role="presentation">
        <span className="fa fa-fw fa-arrow-up icon-with-text-right" aria-hidden={true} />
        {!previous ?
          trans('home') :
          (previousNumbering ?
            previousNumbering + ' ' + previous.title :
            previous.title
          )
        }
      </div>
    </LinkButton>
  )
}

PlayerPrevious.propTypes = {
  path: T.string.isRequired,
  className: T.string,
  previous: T.shape(
    StepTypes.propTypes
  )
}

export {
  PlayerPrevious
}