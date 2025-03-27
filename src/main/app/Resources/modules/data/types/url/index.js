import {trans} from '#/main/app/intl/translation'

import {UrlCell} from '#/main/app/data/types/url/components/cell'
import {UrlDisplay} from '#/main/app/data/types/url/components/display'
import {UrlInput} from '#/main/app/data/types/url/components/input'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'url',
  meta: {
    icon: 'fa fa-fw fa-link',
    label: trans('url', {}, 'data'),
    description: trans('url_desc', {}, 'data')
  },
  components: {
    input: UrlInput,
    display: UrlDisplay,
    cell: UrlCell
  }
})
