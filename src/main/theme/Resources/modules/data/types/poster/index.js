import {trans} from '#/main/app/intl/translation'

import {PosterInput} from '#/main/theme/data/types/poster/components/input'
import {PosterDisplay} from '#/main/theme/data/types/poster/components/display'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'poster',
  meta: {
    icon: 'fa fa-fw fa-picture',
    label: trans('poster', {}, 'data'),
    description: trans('poster_desc', {}, 'data')
  },
  components: {
    input: PosterInput,
    display: PosterDisplay
  }
})
