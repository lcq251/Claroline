import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {EntityInput} from '#/main/app/data/types/entity'

import {SessionCard} from '#/plugin/cursus/session/components/card'
import {Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {MODAL_TRAINING_SESSIONS} from '#/plugin/cursus/modals/sessions'

const SessionInput = props =>
  <EntityInput
    {...props}
    placeholder={trans('no_session', {}, 'cursus')}
    card={SessionCard}
    pickerType={MODAL_TRAINING_SESSIONS}
  />

implementPropTypes(SessionInput, EntityInput.propTypes, {
  value: T.oneOfType([
    T.shape(
      SessionTypes.propTypes
    ),
    T.arrayOf(T.shape(
      SessionTypes.propTypes
    ))
  ])
})

export {
  SessionInput
}
