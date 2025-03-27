import {trans} from '#/main/app/intl/translation'

import {ResourceCell} from '#/main/core/data/types/resource/components/cell'
import {ResourceFilter} from '#/main/core/data/types/resource/components/filter'
import {ResourceInput} from '#/main/core/data/types/resource/components/input'
import {ResourceDisplay} from '#/main/core/data/types/resource/components/display'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'resource',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-folder',
    label: trans('resource_embedded', {}, 'data'),
    description: trans('resource_desc', {}, 'data')
  },
  render: (raw) => raw && raw.map(r => r.name).join(', '),
  components: {
    cell: ResourceCell,
    display: ResourceDisplay,
    input: ResourceInput,
    filter: ResourceFilter
  }
})
