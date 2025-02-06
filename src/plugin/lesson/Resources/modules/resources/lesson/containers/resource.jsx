
import {withReducer} from '#/main/app/store/reducer'

import {LessonResource as LessonResourceComponent} from '#/plugin/lesson/resources/lesson/components/resource'
import {reducer, selectors} from '#/plugin/lesson/resources/lesson/store'

const LessonResource = withReducer(selectors.STORE_NAME, reducer)(
  LessonResourceComponent
)

export {
  LessonResource
}
