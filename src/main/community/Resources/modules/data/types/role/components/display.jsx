import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Role as RoleTypes} from '#/main/community/prop-types'
import {DataMicro} from '#/main/app/data/components/micro'

const RoleDisplay = (props) =>
  <EntityDisplay
    placeholder={trans('no_role', {}, 'community')}
    {...props}
    card={(cardProps) => <DataMicro {...cardProps} object={{name: trans(cardProps.object.translationKey)}} />}
  />

RoleDisplay.propTypes = {
  data: T.oneOfType([
    T.shape(
      RoleTypes.propTypes
    ),
    T.arrayOf(T.shape(
      RoleTypes.propTypes
    ))
  ])
}

export {
  RoleDisplay
}
