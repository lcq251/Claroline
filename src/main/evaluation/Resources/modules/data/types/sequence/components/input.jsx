import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'
import {MODAL_SEQUENCES} from '#/main/evaluation/modals/sequences'

const SequenceInput = props =>
  <EntityInput
    {...props}
    add={trans(props.multiple ? 'add_sequences' : 'add_sequence', {}, 'actions')}
    pickerType={MODAL_SEQUENCES}
  />

implementPropTypes(SequenceInput, EntityInput, {
  value: T.arrayOf(T.shape(
    SequenceTypes.propTypes
  ))
})

export {
  SequenceInput
}
