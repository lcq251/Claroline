import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {FormModal} from '#/main/app/data/modals/form/components/modal'

import {getRule} from '#/plugin/open-badge/badge-rule/utils'
import {BadgeRule} from '#/plugin/open-badge/badge-rule/prop-types'

const ParametersModal = (props) => {
  const [ruleDef, setRuleDef] = useState(null)

  useEffect(() => {
    if (get(props.rule, 'type')) {
      getRule(get(props.rule, 'type')).then(setRuleDef)
    }
  }, [get(props.rule, 'type')])

  return (
    <FormModal
      {...omit(props, 'isNew', 'rule', 'contextType', 'contextId')}
      name="badgeRuleForm"
      title={trans(props.isNew ? 'new_rule' : 'rule', {}, 'badge')}
      subtitle={get(ruleDef, 'meta.label')}
      isNew={props.isNew}
      data={props.rule}
      saveLabel={trans(props.isNew ? 'add_rule' : 'save_rule', {}, 'actions')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [].concat(ruleDef && ruleDef.configure ? ruleDef.configure(props.contextType, props.contextId) : [])
        }
      ]}
      onSave={props.onSave}
    />
  )
}

ParametersModal.propTypes = {
  isNew: T.bool,
  contextType: T.string.isRequired,
  contextId: T.string,
  rule: T.shape(
    BadgeRule.propTypes
  ).isRequired,
  onSave: T.func.isRequired
}

export {
  ParametersModal
}
