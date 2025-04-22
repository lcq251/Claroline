import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'

import {BadgeRule as BadgeRuleTypes} from '#/plugin/open-badge/badge-rule/prop-types'
import get from 'lodash/get'
import {getRule} from '#/plugin/open-badge/badge-rule/utils'

const BadgeRuleDisplay = (props) => {
  const [ruleDef, setRuleDef] = useState(null)

  useEffect(() => {
    if (get(props.rule, 'type')) {
      getRule(get(props.rule, 'type')).then(setRuleDef)
    }
  }, [get(props.rule, 'type')])

  return (
    <div role="presentation" className={props.className}>
      {ruleDef && ruleDef.render(props.rule, props.contextType, props.contextId)}
    </div>
  )
}

BadgeRuleDisplay.propTypes = {
  className: T.string,
  contextType: T.string.isRequired,
  contextId: T.string,
  rule: T.shape(
    BadgeRuleTypes.propTypes
  ).isRequired
}

export {
  BadgeRuleDisplay
}
