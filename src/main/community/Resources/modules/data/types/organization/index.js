import {trans} from '#/main/app/intl/translation'

import {OrganizationDisplay} from '#/main/community/data/types/organization/components/display'
import {OrganizationInput} from '#/main/community/data/types/organization/components/input'
import {OrganizationFilter} from '#/main/community/data/types/organization/components/filter'
import {OrganizationCell} from '#/main/community/data/types/organization/components/cell'

const dataType = {
  name: 'organization',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-building',
    label: trans('organization', {}, 'data'),
    description: trans('organization_desc', {}, 'data')
  },
  components: {
    table: OrganizationCell,
    details: OrganizationDisplay,
    input: OrganizationInput,
    search: OrganizationFilter
  }
}

export {
  dataType
}
