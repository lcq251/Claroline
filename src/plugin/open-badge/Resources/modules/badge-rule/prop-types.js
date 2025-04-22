import {PropTypes as T} from 'prop-types'

const BadgeRuleType = {
  propTypes: {
    name: T.string.isRequired,
    meta: T.shape({
      label: T.string,
      description: T.string
    }),
    render: T.func.isRequired,
    default: T.func,
    configure: T.func
  },
  defaultProps: {}
}

const BadgeRule = {
  propTypes: {
    id: T.string.isRequired,
    type: T.string.isRequired,
    // subject of the rule if any
    subjectClass: T.string,
    subject: T.shape({
      id: T.string.isRequired
    }),
    // custom data of the rule
    data: T.object
  },
  defaultProps: {}
}

export {
  BadgeRuleType,
  BadgeRule
}
