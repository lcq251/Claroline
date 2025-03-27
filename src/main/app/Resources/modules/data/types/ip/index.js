import {trans} from '#/main/app/intl/translation'

import {ip} from '#/main/app/data/types/ip/validators'
import {IpInput} from '#/main/app/data/types/ip/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'ip',

  meta: {
    creatable: false,
    label: trans('ip', {}, 'data'),
    description: trans('ip_desc', {}, 'data')
  },

  validate: ip,

  components: {
    input: IpInput
  }
})
