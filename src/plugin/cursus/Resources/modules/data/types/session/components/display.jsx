import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Session as SessionTypes} from '#/plugin/cursus/prop-types'

const SessionDisplay = (props) =>
  <EntityDisplay
    placeholder={trans('no_session', {}, 'cursus')}
    {...props}
  />

SessionDisplay.propTypes = {
  data: T.shape(
    SessionTypes.propTypes
  )
}

export {
  SessionDisplay
}
