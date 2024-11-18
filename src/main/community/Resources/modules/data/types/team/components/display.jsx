import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'

import {Team as TeamTypes} from '#/main/community/prop-types'
import {TeamCard} from '#/main/community/team/components/card'
import {EntityDisplay} from '#/main/app/data/types/entity'

const TeamDisplay = (props) =>
  <EntityDisplay
    placeholder={trans('no_team', {}, 'community')}
    card={TeamCard}
    data={props.data}
    multiple={true}
  />

TeamDisplay.propTypes = {
  data: T.arrayOf(T.shape(
    TeamTypes.propTypes
  ))
}

export {
  TeamDisplay
}
