
import {declareResource} from '#/main/core/resource'
import {ForumResource} from '#/plugin/forum/resources/forum/containers/resource'

/**
 * Forum resource application.
 */
export default declareResource(ForumResource)
  .addPermissions({
    open: {
      order: 0,
      actions: [
        'Répondre aux sujets ouverts'
      ]
    },
    contribute: {
      order: 1,
      actions: [
        'Créer et administrer de nouveaux sujets'
      ]
    },
    follow: {
      order: 10,
      actions: [
        'Épingler / Désépingler des sujets',
        'Gérer les sujets et messages signalés'
      ]
    },
    edit: {
      order: 20,
      actions: [
        'Administrer tous les sujets'
      ]
    }
  })
