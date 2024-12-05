
import {trans} from '#/main/app/intl'
import {TableData} from '#/main/app/content/list/table/components/data'

import {constants} from '#/main/app/content/list/table/constants'

/**
 * Table view modes for the ListData component
 */
export default {
  [constants.DISPLAY_TABLE]: {
    icon: 'fa fa-fw fa-table-list',
    label: trans('list_display_table'),
    component: TableData,
    options: {
      filterColumns: true // used to know if we need to enable the tool to filter displayed data properties
    }
  }
}
