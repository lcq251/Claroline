import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Team as TeamTypes} from '#/main/community/prop-types'

const TeamDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_team', {}, 'community')}
  />

TeamDisplay.propTypes = {
  data: T.arrayOf(T.shape(
    TeamTypes.propTypes
  ))
}

export {
  TeamDisplay
}
