import {PropTypes as T} from 'prop-types'

import {User} from '#/main/community/user/prop-types'

const Step = {
  propTypes: {
    id: T.string.isRequired,
    slug: T.string.isRequired,
    title: T.string,
    description: T.string,
    poster: T.string,
    display: T.shape({
      numbering: T.string
    }).isRequired,
    primaryResource: T.shape({
      id: T.string.isRequired,
      meta: T.shape({
        type: T.string.isRequired
      })
    }),
    showResourceHeader: T.bool,
    secondaryResources: T.arrayOf(T.shape({
      // minimal resource
    }))
  }
}

const Sequence = {
  propTypes: {
    id: T.string.isRequired,
    name: T.string,
    meta: T.shape({
      published: T.bool
    }),
    display: T.shape({
      numbering: T.oneOf(['none', 'numeric', 'literal', 'custom']),
      showScore: T.bool
    }).isRequired,
    score: T.shape({
      success: T.number,
      total: T.number
    }),
    opening: T.shape({
      secondaryResources: T.oneOf(['_self', '_blank'])
    }),
    steps: T.arrayOf(T.shape(
      Step.propTypes
    )),
    overview: T.shape({
      // message: T.string,
      resource: T.shape({
        id: T.string.isRequired,
        meta: T.shape({
          type: T.string.isRequired
        })
      })
    }),
    end: T.shape({
      display: T.bool,
      message: T.string,
      navigation: T.bool
    })
  },
  defaultProps: {
    meta: {
      published: false
    },
    display: {
      numbering: 'none'
    },
    opening: {
      secondaryResources: '_self'
    },
    steps: []
  }
}

const SequenceEvaluation = {
  propTypes: {
    id: T.string.isRequired,
    date: T.string.isRequired,
    status: T.string.isRequired,
    duration: T.number,
    score: T.number,
    scoreMin: T.number,
    scoreMax: T.number,
    progression: T.number,
    sequence: T.shape(
      Sequence.propTypes
    ),
    user: T.shape(
      User.propTypes
    ),
    required: T.bool,
    estimatedDuration: T.string
  }
}

export {
  Sequence,
  Step,
  SequenceEvaluation
}
