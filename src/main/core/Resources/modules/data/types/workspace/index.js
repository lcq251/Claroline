import {trans} from '#/main/app/intl/translation'

import {WorkspaceCell} from '#/main/core/data/types/workspace/components/cell'
import {WorkspaceDisplay} from '#/main/core/data/types/workspace/components/display'
import {WorkspaceInput} from '#/main/core/data/types/workspace/components/input'
import {WorkspaceFilter} from '#/main/core/data/types/workspace/components/filter'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'workspace',
  meta: {
    icon: 'fa fa-fw fa fa-book',
    label: trans('workspace', {}, 'data'),
    description: trans('workspace_desc', {}, 'data')
  },
  components: {
    display: WorkspaceDisplay,
    input: WorkspaceInput,
    cell: WorkspaceCell,
    filter: WorkspaceFilter
  }
})
