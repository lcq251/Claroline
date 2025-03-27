import {trans} from '#/main/app/intl/translation'

import {CourseDisplay} from '#/plugin/cursus/data/types/course/components/display'
import {CourseInput} from '#/plugin/cursus/data/types/course/components/input'
import {CourseFilter} from '#/plugin/cursus/data/types/course/components/filter'
import {CourseCell} from '#/plugin/cursus/data/types/course/components/cell'
import {declareDataType} from '#/main/app/data/types'

export default declareDataType({
  name: 'training_course',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa fa-graduation-cap',
    label: trans('course', {}, 'data'),
    description: trans('course_desc', {}, 'data')
  },
  render: (raw) => raw ? raw.name : null,
  components: {
    cell: CourseCell,
    display: CourseDisplay,
    input: CourseInput,
    filter: CourseFilter
  }
})
