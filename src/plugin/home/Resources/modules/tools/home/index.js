import {declareTool} from '#/main/core/tool'

import {HomeTool} from '#/plugin/home/tools/home/containers/tool'

/**
 * HomeTool application.
 */
export default declareTool(HomeTool)
  .addPermissions({
    edit: {
      order: 10,
      actions: [
        'Créer et administrer de nouvelles pages',
        'Administrer toutes les pages'
      ]
    }
  })
