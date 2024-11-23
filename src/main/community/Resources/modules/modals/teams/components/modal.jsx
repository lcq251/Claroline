import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {DataMicro} from '#/main/app/data/components/micro'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'

import {TeamCard} from '#/main/community/team/components/card'

const TeamsModal = (props) =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-user-group"
    name="teamsPicker"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true,
        render: (row) => <DataMicro object={row} />
      }, {
        name: 'meta.description',
        type: 'string',
        label: trans('description'),
        options: {long: true},
        displayed: true
      }
    ]}
    card={TeamCard}
  />

TeamsModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool
}

TeamsModal.defaultProps = {
  url:['apiv2_team_list'],
  title: trans('teams', {}, 'community')
}

export {
  TeamsModal
}
