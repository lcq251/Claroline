import {PropTypes as T} from 'prop-types'

import {User} from '#/main/community/user/prop-types'

const UserEvaluation = {
  propTypes: {
    id: T.string.isRequired,
    lastActivityAt: T.string,
    startedAt: T.string,
    endedAt: T.string,
    status: T.string.isRequired,
    user: T.shape(
      User.propTypes
    ),
    progression: T.number,
    rawScore: T.shape({
      current: T.number,
      total: T.number
    }),
    displayScore: T.shape({
      current: T.number,
      total: T.number
    }),
    duration: T.number,
    estimatedDuration: T.string
  }
}

export {
  UserEvaluation
}
