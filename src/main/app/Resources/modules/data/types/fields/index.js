import {trans} from '#/main/app/intl/translation'

import {FieldsInput} from '#/main/app/data/types/fields/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'fields',
  meta: {
    icon: 'fa fa-fw fa-dot',
    label: trans('fields', {}, 'data'),
    description: trans('fields_desc', {}, 'data')
  },
  components: {
    input: FieldsInput
  }
})
