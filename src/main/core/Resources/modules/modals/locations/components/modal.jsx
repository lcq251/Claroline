import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {PickerModal} from '#/main/app/data/modals/picker/components/modal'

import {LocationCard} from '#/main/core/data/types/location/components/card'

const LocationsModal = props =>
  <PickerModal
    {...props}
    icon="fa fa-fw fa-map-marker-alt"
    name="locationsPicker"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true
      }, {
        name: 'meta.description',
        type: 'string',
        label: trans('description'),
        options: {long: true},
        sortable: false
      }, {
        name: 'address',
        type: 'address',
        label: trans('address'),
        displayed: true
      }, {
        name: 'phone',
        type: 'string',
        label: trans('phone'),
        displayed: true
      }
    ]}
    card={LocationCard}
  />

LocationsModal.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  selectAction: T.func.isRequired,
  multiple: T.bool
}

LocationsModal.defaultProps = {
  url: ['apiv2_location_list'],
  title: trans('locations')
}

export {
  LocationsModal
}
