import {trans} from '#/main/app/intl/translation'
import {declareDataType} from '#/main/app/data/types'

import {SequenceDisplay} from '#/main/evaluation/data/types/sequence/components/display'
import {SequenceInput} from '#/main/evaluation/data/types/sequence/components/input'
import {SequenceFilter} from '#/main/evaluation/data/types/sequence/components/filter'
import {SequenceCell} from '#/main/evaluation/data/types/sequence/components/cell'

export default declareDataType({
  name: 'sequence',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-route',
    label: trans('sequence', {}, 'data'),
    description: trans('sequence_desc', {}, 'data')
  },
  render: (raw) => raw && raw.map(s => s.name).join(', '),
  components: {
    cell: SequenceCell,
    display: SequenceDisplay,
    input: SequenceInput,
    filter: SequenceFilter
  }
})
