import {trans} from '#/main/app/intl/translation'

import {GroupDisplay} from '#/main/community/data/types/group/components/display'
import {GroupInput} from '#/main/community/data/types/group/components/input'
import {GroupFilter} from '#/main/community/data/types/group/components/filter'
import {GroupCell} from '#/main/community/data/types/group/components/cell'

const dataType = {
  name: 'group',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-users',
    label: trans('group', {}, 'data'),
    description: trans('group_desc', {}, 'data')
  },
  render: (raw) => raw && raw.map(g => g.name).join(', '),
  components: {
    table: GroupCell,
    details: GroupDisplay,
    input: GroupInput,
    search: GroupFilter
  }
}

export {
  dataType
}
