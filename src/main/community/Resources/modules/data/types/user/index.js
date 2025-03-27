import {trans} from '#/main/app/intl/translation'

import {UserCell} from '#/main/community/data/types/user/components/cell'
import {UserDisplay} from '#/main/community/data/types/user/components/display'
import {UserInput} from '#/main/community/data/types/user/components/input'
import {UserFilter} from '#/main/community/data/types/user/components/filter'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'user',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-user',
    label: trans('user'),
    description: trans('user_desc')
  },
  components: {
    display: UserDisplay,
    input: UserInput,
    cell: UserCell,
    filter: UserFilter
  }
})
