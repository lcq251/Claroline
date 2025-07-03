
import {declareResource} from '#/main/core/resource'
import {DirectoryResource} from '#/main/core/resources/directory/containers/resource'

/**
 * Directory resource application.
 */
export default declareResource(DirectoryResource)
  .addPermissions({
    create: {
      order: 1,
      actions: [
        'Créer et administrer de nouvelles ressources'
      ]
    }
  })
