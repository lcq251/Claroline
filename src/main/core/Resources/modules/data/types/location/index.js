import {trans} from '#/main/app/intl/translation'

import {LocationDisplay} from '#/main/core/data/types/location/components/display'
import {LocationFilter} from '#/main/core/data/types/location/components/filter'
import {LocationInput} from '#/main/core/data/types/location/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'location',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa-map-marker-alt',
    label: trans('location', {}, 'data'),
    description: trans('location_desc', {}, 'data')
  },
  render: (raw) => raw ? raw.name : null,
  components: {
    display: LocationDisplay,
    input: LocationInput,
    filter: LocationFilter
  }
})
