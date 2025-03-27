import {trans} from '#/main/app/intl/translation'

import {RoleDisplay} from '#/main/community/data/types/role/components/display'
import {RoleInput} from '#/main/community/data/types/role/components/input'
import {RoleFilter} from '#/main/community/data/types/role/components/filter'
import {RoleCell} from '#/main/community/data/types/role/components/cell'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'role',
  meta: {
    icon: 'fa fa-fw fa fa-id-badge',
    label: trans('role', {}, 'data'),
    description: trans('role_desc', {}, 'data')
  },
  render: (raw) => raw && raw.map(r => trans(r.translationKey)).join(', '),
  components: {
    display: RoleDisplay,
    input: RoleInput,
    cell: RoleCell,
    filter: RoleFilter
  }
})
