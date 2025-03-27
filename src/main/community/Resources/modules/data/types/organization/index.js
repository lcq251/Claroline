import {trans} from '#/main/app/intl/translation'

import {OrganizationDisplay} from '#/main/community/data/types/organization/components/display'
import {OrganizationInput} from '#/main/community/data/types/organization/components/input'
import {OrganizationFilter} from '#/main/community/data/types/organization/components/filter'
import {OrganizationCell} from '#/main/community/data/types/organization/components/cell'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'organization',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-building',
    label: trans('organization', {}, 'data'),
    description: trans('organization_desc', {}, 'data')
  },
  components: {
    cell: OrganizationCell,
    display: OrganizationDisplay,
    input: OrganizationInput,
    filter: OrganizationFilter
  }
})
