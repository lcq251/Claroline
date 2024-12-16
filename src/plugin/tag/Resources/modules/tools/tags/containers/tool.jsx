import {withReducer} from '#/main/app/store/reducer'

import {TagsTool as TagsToolComponent} from '#/plugin/tag/tools/tags/components/tool'
import {reducer, selectors} from '#/plugin/tag/tools/tags/store'

const TagsTool = withReducer(selectors.STORE_NAME, reducer)(
  TagsToolComponent
)

export {
  TagsTool
}
