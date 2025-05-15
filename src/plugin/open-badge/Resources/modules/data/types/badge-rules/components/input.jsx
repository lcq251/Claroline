import React from 'react'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {Button, Toolbar} from '#/main/app/action'
import {implementPropTypes, PropTypes as T} from '#/main/app/prop-types'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'

import {BadgeRule as BadgeRuleTypes} from '#/plugin/open-badge/badge-rule/prop-types'
import {BadgeRuleDisplay} from '#/plugin/open-badge/badge-rule/components/display'
import {MODAL_BADGE_RULE_CREATION} from '#/plugin/open-badge/badge-rule/modals/creation'
import {MODAL_BADGE_RULE_PARAMETERS} from '#/plugin/open-badge/badge-rule/modals/parameters'

const BadgeRulesInput = (props) => {
  return (
    <>
      {isEmpty(props.value) &&
        <ContentPlaceholder title={trans('no_rule', {}, 'badge')} size={props.size} />
      }

      {!isEmpty(props.value) &&
        <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
          {props.value.map((rule, index) =>
            <li key={rule.id} className="d-flex flex-row align-items-start py-2 px-3 gap-3 bg-secondary-subtle rounded-2 border border-transparent">
              <BadgeRuleDisplay
                className="flex-fill"
                rule={rule}
                contextType={props.contextType}
                contextId={props.contextId}
              />

              <Toolbar
                id={`${rule.id}-actions`}
                className="my-n1 me-n2"
                tooltip="bottom"
                buttonName="btn p-1"
                defaultName="btn-text-body focus-ring focus-ring-secondary"
                dangerousName="btn-text-body focus-ring"
                actions={[
                  {
                    name: 'edit',
                    type: MODAL_BUTTON,
                    icon: 'fa fa-fw fa-pencil',
                    label: trans('edit', {}, 'actions'),
                    modal: [MODAL_BADGE_RULE_PARAMETERS, {
                      rule: rule,
                      isNew: false,
                      onSave: (updatedRule) => {
                        const newRules = props.value.slice()
                        newRules[index] = updatedRule

                        props.onChange(newRules)
                      }
                    }]
                  }, {
                    name: 'delete',
                    type: CALLBACK_BUTTON,
                    icon: 'fa fa-fw fa-trash',
                    label: trans('delete', {}, 'actions'),
                    confirm: trans('delete_rule_confirm_message', {}, 'badge'),
                    callback: () => {
                      const rules = props.value.slice()
                      rules.splice(index, 1)

                      props.onChange(rules)
                    },
                    dangerous: true
                  }
                ]}
              />
            </li>
          )}
        </ul>
      }

      <Button
        type={MODAL_BUTTON}
        className="btn btn-body w-100 mt-3"
        icon="fa fa-fw fa-plus"
        label={trans('add_rule', {}, 'actions')}
        disabled={props.disabled}
        modal={[MODAL_BADGE_RULE_CREATION, {
          contextType: props.contextType,
          contextId: props.contextId,
          onSave: (rule) => {
            const newRules = props.value.slice()
            newRules.push(rule)

            props.onChange(newRules)
          }
        }]}
      />
    </>
  )
}

implementPropTypes(BadgeRulesInput, DataInputTypes, {
  contextType: T.string.isRequired,
  contextId: T.string,
  // more precise value type
  value: T.arrayOf(T.shape(
    BadgeRuleTypes.propTypes
  ))
}, {
  value: []
})

export {
  BadgeRulesInput
}
