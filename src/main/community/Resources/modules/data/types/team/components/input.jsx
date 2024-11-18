import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {trans} from '#/main/app/intl/translation'
import {EntityInput} from '#/main/app/data/types/entity'

import {TeamCard} from '#/main/community/team/components/card'
import {Team as TeamTypes} from '#/main/community/prop-types'
import {MODAL_TEAMS} from '#/main/community/modals/teams'

const TeamInput = props =>
  <EntityInput
    {...props}
    placeholder={trans('no_team', {}, 'community')}
    card={TeamCard}
    pickerType={MODAL_TEAMS}
  />

implementPropTypes(TeamInput, EntityInput.propTypes, {
  value: T.oneOfType([
    T.shape(
      TeamTypes.propTypes
    ),
    T.arrayOf(T.shape(
      TeamTypes.propTypes
    ))
  ])
})

export {
  TeamInput
}
