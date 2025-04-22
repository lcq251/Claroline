import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'
import {constants as listConstants} from '#/main/app/content/list'

import {BadgeCard} from '#/plugin/open-badge/badge/components/card'
import {BadgeImage} from '#/plugin/open-badge/badge/components/image'

const BadgesModal = (props) =>
  <PickerModal
    icon="fa fa-fw fa-trophy"
    {...props}
    name="badgePicker"
    definition={[
      {
        name: 'name',
        label: trans('name'),
        displayed: true,
        primary: true,
        render: (badge) => (
          <div className="d-flex flex-direction-row gap-3 align-items-center">
            <BadgeImage badge={badge} size="xs" />
            {badge.name}
          </div>
        )
      }, {
        name: 'meta.description',
        type: 'string',
        label: trans('description'),
        options: {long: true},
        displayed: true,
        sortable: false
      }, {
        name: 'meta.createdAt',
        type: 'date',
        label: trans('creation_date'),
        options: {time: true},
        filterable: false,
        sortable: false
      }, {
        name: 'meta.updatedAt',
        type: 'date',
        label: trans('modification_date'),
        options: {time: true},
        filterable: false,
        sortable: false
      }, {
        name: 'tags',
        type: 'tag',
        label: trans('tags'),
        sortable: false,
        options: {
          objectClass: 'Claroline\\OpenBadgeBundle\\Entity\\BadgeClass'
        }
      }
    ]}
    card={BadgeCard}
    displayMode={listConstants.DISPLAY_LIST}
  />

BadgesModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool
}

BadgesModal.defaultProps = {
  url: ['apiv2_badge_list'],
  title: trans('badges', {}, 'badge')
}

export {
  BadgesModal
}
