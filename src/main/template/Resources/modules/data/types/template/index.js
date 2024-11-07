import {trans} from '#/main/app/intl/translation'

import {TemplateDisplay} from '#/main/template/data/types/template/components/display'
import {TemplateInput} from '#/main/template/data/types/template/components/input'
import {TemplateCell} from '#/main/template/data/types/template/components/cell'
import {TemplateFilter} from '#/main/template/data/types/template/components/filter'

const dataType = {
  name: 'template',
  meta: {
    icon: 'fa fa-fw fa fa-file-alt',
    label: trans('template', {}, 'data'),
    description: trans('template_desc', {}, 'data')
  },
  components: {
    details: TemplateDisplay,
    input: TemplateInput,
    search: TemplateFilter,
    table: TemplateCell
  }
}

export {
  dataType
}
