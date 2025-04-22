import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'

const SequenceDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_sequence', {}, 'evaluation')}
  />

SequenceDisplay.propTypes = {
  data: T.oneOfType([
    T.shape(
      SequenceTypes.propTypes
    ),
    T.arrayOf(T.shape(
      SequenceTypes.propTypes
    ))
  ])
}

export {
  SequenceDisplay
}
