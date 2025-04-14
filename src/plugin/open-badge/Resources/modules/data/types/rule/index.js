import {trans} from '#/main/app/intl/translation'

import {RuleInput} from '#/plugin/open-badge/data/types/rule/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'rule',
  meta: {
    icon: 'fa fa-fw fa-calendar',
    label: trans('rule'),
    description: trans('rule')
  },
  components: {
    input: RuleInput
  }
})
