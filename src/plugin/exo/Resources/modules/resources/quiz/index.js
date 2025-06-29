
import {declareResource} from '#/main/core/resource'
import {QuizResource} from '#/plugin/exo/resources/quiz/containers/resource'

import {registerDefaultItemTypes} from '#/plugin/exo/items/item-types'
import {registerDefaultContentItemTypes} from '#/plugin/exo/contents/utils'

registerDefaultItemTypes()
registerDefaultContentItemTypes()

/**
 * Quiz resource application.
 */
export default declareResource(QuizResource)
