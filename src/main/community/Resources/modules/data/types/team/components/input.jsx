import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {trans} from '#/main/app/intl/translation'
import {EntityInput} from '#/main/app/data/types/entity'

import {Team as TeamTypes} from '#/main/community/prop-types'
import {MODAL_TEAMS} from '#/main/community/modals/teams'

const TeamInput = (props) =>
  <EntityInput
    {...props}
    placeholder={trans('no_team', {}, 'community')}
    add={trans(props.multiple ? 'add_teams' : 'add_team', {}, 'actions')}
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
