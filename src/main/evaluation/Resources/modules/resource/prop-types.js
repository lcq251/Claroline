import {PropTypes as T} from 'prop-types'

import {ResourceNode} from '#/main/core/resource/prop-types'
import {User} from '#/main/community/user/prop-types'

const ResourceEvaluation = {
  propTypes: {
    id: T.string.isRequired,
    lastActivityAt: T.string,
    startedAt: T.string,
    endedAt: T.string,
    status: T.string.isRequired,
    duration: T.number,
    score: T.number,
    scoreMin: T.number,
    scoreMax: T.number,
    progression: T.number,
    resourceNode: T.shape(
      ResourceNode.propTypes
    ),
    user: T.shape(
      User.propTypes
    ),
    nbAttempts: T.number,
    nbOpenings: T.number,
    required: T.bool
  },
  defaultProps: {
    nbAttempts: 0,
    nbOpenings: 0,
    required: false
  }
}

const ResourceAttempt = {
  propTypes: {
    id: T.string.isRequired,
    lastActivityAt: T.string,
    startedAt: T.string,
    endedAt: T.string,
    status: T.string.isRequired,
    duration: T.number,
    score: T.number,
    scoreMin: T.number,
    scoreMax: T.number,
    progression: T.number,
    resourceNode: T.shape(
      ResourceNode.propTypes
    ),
    user: T.shape(
      User.propTypes
    ),
    comment: T.string,
    data: T.oneOfType([T.object, T.array])
  },
  defaultProps: {

  }
}

export {
  ResourceEvaluation,
  ResourceAttempt
}
