import React, {useEffect, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {Modal} from '#/main/app/overlays'
import {trans} from '#/main/app/intl'
import {makeId} from '#/main/app/utils/id'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'

import {getCreatableTypes} from '#/main/app/data/types'
import {MODAL_FIELD_PARAMETERS} from '#/main/app/data/types/fields/modals/parameters'
import {Field as FieldTypes} from '#/main/app/data/types/fields/prop-types'

const CreationModal = (props) => {
  const [types, setTypes] = useState([])

  useEffect(() => {
    getCreatableTypes().then(types => {
      setTypes(types)
    })
  }, [isEmpty(types)])

  return (
    <Modal
      {...omit(props, 'fields', 'add')}
      title={trans('new_field')}
      subtitle={trans('new_field_select')}
      centered={true}
    >
      <div className="modal-body" role="presentation">
        <ContentMenu
          className="mb-3"
          color={true}
          search={true}
          items={types
            .sort((a, b) => {
              if (get(a, 'meta.label') > get(b, 'meta.label')) {
                return 1
              } else if (get(a, 'meta.label') < get(b, 'meta.label')) {
                return -1
              }

              return 0
            })
            .map(type => Object.assign({}, type.meta, {
              id: type.name,
              action: {
                type: MODAL_BUTTON,
                onClick: props.fadeModal,
                modal: [MODAL_FIELD_PARAMETERS, {
                  field: merge({}, FieldTypes.defaultProps, {
                    // we generate an ID in front to make the field directly usable in the condition parameters
                    id: makeId(),
                    type: type.name
                  }),
                  isNew: true,
                  fields: props.fields,
                  save: props.add
                }]
              }
            }))
          }
        />
      </div>
    </Modal>
  )
}

CreationModal.propTypes = {
  fields: T.array,
  add: T.func.isRequired,

  // from modal
  fadeModal: T.func.isRequired
}

export {
  CreationModal
}
