import React from 'react'
import {PropTypes as T} from 'prop-types'
import {ResourceAttempt} from '#/main/evaluation/resource/prop-types'

const UserProgressionOverview = (props) => {
  return (
    <>
    </>
  )
}

UserProgressionOverview.propTypes = {
  progression: T.arrayOf(T.shape(
    ResourceAttempt.propTypes
  ))
}

export {
  UserProgressionOverview
}
