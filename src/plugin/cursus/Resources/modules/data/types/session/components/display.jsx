import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {EntityDisplay} from '#/main/app/data/types/entity'

import {Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {SessionCard} from '#/plugin/cursus/session/components/card'

const SessionDisplay = (props) =>
  <EntityDisplay
    {...props}
    placeholder={trans('no_session', {}, 'cursus')}
    card={SessionCard}
  />

SessionDisplay.propTypes = {
  data: T.shape(
    SessionTypes.propTypes
  )
}

export {
  SessionDisplay
}
