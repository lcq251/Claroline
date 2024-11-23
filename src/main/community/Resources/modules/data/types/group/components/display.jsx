import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Group as GroupTypes} from '#/main/community/prop-types'

const GroupDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_group', {}, 'community')}
  />

GroupDisplay.propTypes = {
  data: T.oneOfType([
    T.shape(
      GroupTypes.propTypes
    ),
    T.arrayOf(T.shape(
      GroupTypes.propTypes
    ))
  ])
}

export {
  GroupDisplay
}
