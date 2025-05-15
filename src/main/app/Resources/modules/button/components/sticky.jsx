import React, {useEffect, useId, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'
import omit from 'lodash/omit'

import useScrollParent from '@restart/ui/useScrollParent'
import Waypoint, {Position}  from '@restart/ui/Waypoint'

import {Button} from '#/main/app/action'

const ButtonSticky = (props) => {
  if (!get(props, 'displayed', true)) {
    return null
  }

  const buttonId = useId()
  const [element, attachRef] = useState(null)

  const scrollParent = useScrollParent(element)

  const threshold = 100;
  const [showLabel, setShowLabel] = useState(true)
  const [lastPosition, setLastPosition] = useState(scrollParent ? scrollParent.scrollTop : 0)
  const [originalPosition, setOriginalPosition] = useState(scrollParent ? scrollParent.scrollTop : 0)

  useEffect(() => {
    function handleScroll() {
      let diff
      if (lastPosition > scrollParent.scrollTop) {
        // scroll up
        diff = originalPosition - scrollParent.scrollTop
        if (diff >= threshold) {
          setShowLabel(true)
          setOriginalPosition(scrollParent.scrollTop)
        }
      } else {
        // scroll down
        diff = scrollParent.scrollTop - originalPosition
        if (diff >= threshold) {
          setShowLabel(false)
          setOriginalPosition(scrollParent.scrollTop)
        }
      }

      setLastPosition(scrollParent.scrollTop)
    }

    if (scrollParent) {
      scrollParent.addEventListener('scroll', handleScroll)
    }


    return () => {
      if (scrollParent) {
        scrollParent.removeEventListener('scroll', handleScroll)
      }
    }
  })

  return (
    <>
      <Waypoint
        onPositionChange={(details) => {
          if (details.previousPosition && (Position.INSIDE === details.position || Position.AFTER === details.position)) {
            setShowLabel(true)
            setOriginalPosition(scrollParent.scrollTop)
          }
        }}
      />

      <div className={classes('sticky-bottom ms-auto z-2', props.className)} role="presentation" ref={attachRef}>
        <Button
          id={buttonId}
          className="btn btn-primary btn-sticky p-3 mb-4 d-flex align-items-center rounded-4"
          {...omit(props, 'label', 'icon', 'className')}
        >
          <span className={classes(props.icon || 'fa fa-plus', 'fa-fw fs-lg')} aria-hidden={true} />
          <span className={classes('label', !showLabel && 'label-hidden')} role="presentation">{props.label}</span>
        </Button>
      </div>
    </>
  )
}

ButtonSticky.propTypes = {
  className: T.string,
  // ActionTypes
}

export {
  ButtonSticky
}
