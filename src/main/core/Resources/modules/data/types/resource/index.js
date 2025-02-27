import {trans} from '#/main/app/intl/translation'

import {ResourceCell} from '#/main/core/data/types/resource/components/cell'
import {ResourceFilter} from '#/main/core/data/types/resource/components/filter'
import {ResourceInput} from '#/main/core/data/types/resource/components/input'
import {ResourceDisplay} from '#/main/core/data/types/resource/components/display'

const dataType = {
  name: 'resource',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-folder',
    label: trans('resource_embedded', {}, 'data'),
    description: trans('resource_desc', {}, 'data')
  },
  render: (raw) => raw && raw.map(r => r.name).join(', '),
  components: {
    table: ResourceCell,
    details: ResourceDisplay,
    input: ResourceInput,
    search: ResourceFilter
  }
}

export {
  dataType
}
