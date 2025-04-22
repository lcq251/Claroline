import React from 'react'
import {PropTypes as T} from 'prop-types'

import {EntityCell} from '#/main/app/data/types/entity/components/cell'

import {Sequence as SequenceTypes} from '#/main/evaluation/sequence/prop-types'

const SequenceCell = props =>
  <EntityCell
    {...props}
  />

SequenceCell.propTypes = {
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
  SequenceCell
}
