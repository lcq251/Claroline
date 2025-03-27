import {trans} from '#/main/app/intl/translation'
import {chain, array, lengthInRange} from '#/main/app/data/types/validators'
import {validateProp} from '#/main/app/content/form/validator'

import {CollectionDisplay} from '#/main/app/data/types/collection/components/display'
import {CollectionGroup} from '#/main/app/data/types/collection/components/group'
import {CollectionInput} from '#/main/app/data/types/collection/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'collection',
  meta: {
    icon: 'fa fa-fw fa-th',
    label: trans('collection', {}, 'data'),
    description: trans('collection_desc', {}, 'data')
  },

  validate(value, options = {}) {
    return chain(value, options, [array, lengthInRange, (value) => {
      if (value) {
        return Promise
          .all(
            value.map((item) => validateProp({
              type: options.type,
              required: true,
              options: options.options
            }, item))
          )
      }
    }])
  },

  components: {
    group: CollectionGroup,
    input: CollectionInput,
    display: CollectionDisplay
  }
})
