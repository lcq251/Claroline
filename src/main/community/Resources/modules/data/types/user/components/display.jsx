import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'
import {DataMicro} from '#/main/app/data/components/micro'

import {User as UserTypes} from '#/main/community/prop-types'

const UserDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_user', {}, 'community')}
    card={(cardProps) => <DataMicro {...cardProps} object={{thumbnail: cardProps.object.picture, name: cardProps.object.name}} />}
  />

UserDisplay.propTypes = {
  data: T.oneOfType([
    T.shape(
      UserTypes.propTypes
    ),
    T.arrayOf(T.shape(
      UserTypes.propTypes
    ))
  ])
}

export {
  UserDisplay
}
