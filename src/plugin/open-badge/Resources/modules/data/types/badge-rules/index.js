import {trans} from '#/main/app/intl/translation'
import {declareDataType} from '#/main/app/data/types'

import {BadgeRulesInput} from '#/plugin/open-badge/data/types/badge-rules/components/input'

export default declareDataType({
  name: 'badge-rules',
  meta: {
    icon: 'fa fa-fw fa-calendar',
    label: trans('rule'),
    description: trans('rule')
  },
  components: {
    input: BadgeRulesInput
  }
})
