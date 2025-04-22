import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {Modal} from '#/main/app/overlays'
import {trans} from '#/main/app/intl'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'

import {MODAL_BADGE_RULE_PARAMETERS} from '#/plugin/open-badge/badge-rule/modals/parameters'
import {actions} from '#/plugin/open-badge/badge-rule/modals/creation/actions'
import {makeId} from '#/main/app/utils/id'
import {getRules} from '#/plugin/open-badge/badge-rule/utils'

const CreationModal = (props) => {
  const dispatch = useDispatch()
  const [types, setTypes] = useState({
    definitions: [],
    available: []
  })

  useEffect(() => {
    if (props.contextType) {
      getRules().then((definitions) => {
        dispatch(actions.fetchRuleTypes(props.contextType, props.contextId)).then((availableRules) => setTypes({
          definitions: definitions,
          available: availableRules
        }))
      })
    }
  }, [props.contextType, props.contextId])

  return (
    <Modal
      {...omit(props, 'contextType', 'contextId', 'onSave')}
      title={trans('new_rule', {}, 'badge')}
      subtitle={trans('new_rule_select', {}, 'badge')}
      centered={true}
    >
      <div className="modal-body" role="presentation">
        <ContentMenu
          className="mb-3"
          color={true}
          search={true}
          searchPlaceholder={trans('search_rule', {}, 'badge')}
          items={get(types, 'definitions', [])
            .filter(type => get(types, 'available', []).includes(type.name))
            .sort((a, b) => {
              if (get(a, 'meta.label') > get(b, 'meta.label')) {
                return 1
              } else if (get(a, 'meta.label') < get(b, 'meta.label')) {
                return -1
              }

              return 0
            })
            .map(type => {
              return ({
                id: type.name,
                label: get(type, 'meta.label'),
                // description: get(type, 'meta.description'),
                action: {
                  type: MODAL_BUTTON,
                  onClick: props.fadeModal,
                  modal: [MODAL_BADGE_RULE_PARAMETERS, {
                    isNew: true,
                    contextType: props.contextType,
                    contextId: props.contextId,
                    rule: type.default ? type.default({
                      id: makeId(),
                      type: type.name,
                      data: {}
                    }, props.contextType, props.contextId) : {
                      id: makeId(),
                      type: type.name,
                      data: {}
                    },
                    onSave: props.onSave
                  }]
                }
              })
            })
          }
        />
      </div>
    </Modal>
  )
}

CreationModal.propTypes = {
  contextType: T.string.isRequired,
  contextId: T.string,
  onSave: T.func.isRequired,

  // from modal
  fadeModal: T.func.isRequired
}

export {
  CreationModal
}
