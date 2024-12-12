import {declareTool} from '#/main/core/tool'

import {ProgressionTool} from '#/main/evaluation/tools/progression/containers/tool'
import {ProgressionPreview} from '#/main/evaluation/tools/progression/components/preview'

/**
 * Progression tool application.
 */
export default declareTool(ProgressionTool, null, ProgressionPreview)
