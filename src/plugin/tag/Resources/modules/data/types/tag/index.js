import {trans} from '#/main/app/intl/translation'

import {TagCell} from '#/plugin/tag/data/types/tag/components/cell'
import {TagDisplay} from '#/plugin/tag/data/types/tag/components/display'
import {TagFilter} from '#/plugin/tag/data/types/tag/components/filter'
import {TagInput} from '#/plugin/tag/data/types/tag/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'tag',
  meta: {
    icon: 'fa fa-fw fa-tags',
    label: trans('tag', {}, 'data'),
    description: trans('tag_desc', {}, 'data')
  },
  components: {
    display: TagDisplay,
    cell: TagCell,
    filter: TagFilter,
    input: TagInput
  }
})
