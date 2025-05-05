import {PropTypes as T} from 'prop-types'

import {NUMBERING_NONE, NUMBERINGS} from '#/main/app/utils/numbering'

const ChoiceItem = {
  propTypes: {
    choices: T.arrayOf(T.shape({
      id: T.string.isRequired
    })).isRequired,
    solutions: T.arrayOf(T.shape({
      id: T.string.isRequired, // the id of the linked choice
      score: T.number,
      feedback: T.string
    })),
    numbering: T.oneOf(Object.keys(NUMBERINGS)),
    multiple: T.bool.isRequired,
    random: T.bool.isRequired,
    direction: T.oneOf(['vertical', 'horizontal'])
  },
  defaultProps: {
    choices: [],
    solutions: [],
    numbering: NUMBERING_NONE,
    multiple: false,
    random: false,
    direction: 'vertical'
  }
}

export {
  ChoiceItem
}
