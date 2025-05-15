import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'

const ResourceDisplay = (props) =>
  <EntityDisplay
    placeholder={trans('no_resource', {}, 'resource')}
    {...props}
  />

ResourceDisplay.propTypes = {
  data: T.oneOfType([
    T.shape(
      ResourceNodeTypes.propTypes
    ),
    T.arrayOf(T.shape(
      ResourceNodeTypes.propTypes
    ))
  ])
}

export {
  ResourceDisplay
}
