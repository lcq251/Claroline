import {trans} from '#/main/app/intl/translation'

import {RoleDisplay} from '#/main/community/data/types/role/components/display'
import {RoleInput} from '#/main/community/data/types/role/components/input'
import {RoleFilter} from '#/main/community/data/types/role/components/filter'
import {RoleCell} from '#/main/community/data/types/role/components/cell'

const dataType = {
  name: 'role',
  meta: {
    icon: 'fa fa-fw fa fa-id-badge',
    label: trans('role', {}, 'data'),
    description: trans('role_desc', {}, 'data')
  },
  render: (raw) => raw && raw.map(r => trans(r.translationKey)).join(', '),
  components: {
    details: RoleDisplay,
    input: RoleInput,
    table: RoleCell,
    search: RoleFilter
  }
}

export {
  dataType
}
