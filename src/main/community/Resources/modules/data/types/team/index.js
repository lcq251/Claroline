import {trans} from '#/main/app/intl/translation'

import {TeamDisplay} from '#/main/community/data/types/team/components/display'
import {TeamInput} from '#/main/community/data/types/team/components/input'
import {TeamFilter} from '#/main/community/data/types/team/components/filter'
import {TeamCell} from '#/main/community/data/types/team/components/cell'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'team',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-users',
    label: trans('team', {}, 'data'),
    description: trans('team_desc', {}, 'data')
  },
  render: (raw) => raw && raw.map(t => t.name).join(', '),
  components: {
    display: TeamDisplay,
    input: TeamInput,
    filter: TeamFilter,
    cell: TeamCell
  }
})
