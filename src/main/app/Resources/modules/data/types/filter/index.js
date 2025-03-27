import {trans} from '#/main/app/intl/translation'

import {FilterInput} from '#/main/app/data/types/filter/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'filter',
  validate: (value, options) => {
    if (value) {
      if (!value.property) {
        return trans('This filter should have a name.', {}, 'validators')
      }

      if (value.property && -1 === options.properties.findIndex(prop => prop.alias ? value.property === prop.alias : value.property === prop.name)) {
        return trans('This filter should use a filterable property.', {}, 'validators')
      }

      if (undefined === value.value) {
        return trans('This filter should have a value.', {}, 'validators')
      }
    }
  },

  components: {
    input: FilterInput
  }
})
