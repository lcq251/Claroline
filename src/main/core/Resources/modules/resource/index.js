import merge from 'lodash/merge'

import {route} from '#/main/core/resource/routing'
import {Resource} from '#/main/core/resource/components/main'
import {ResourcePage} from '#/main/core/resource/components/page'
import {ResourceOverview} from '#/main/core/resource/components/overview'
import {ResourceEditor} from '#/main/core/resource/editor/containers/main'
import {selectors} from '#/main/core/resource/store'

/**
 * Declare a new resource to the application.
 *
 * NB1. Resource MUST be registered in the `plugin.js` file of its plugin.
 * NB2. Resource component tree MUST start with the `Resource` component
 */
function declareResource(ResourceComponent, additional) {
  return {
    component: ResourceComponent,
    ...additional,
    permissions: {
      open: {
        order: 0,
        actions: [
          'Voir et ouvrir la ressource'
        ]
      },
      export: {
        order: 5,
        actions: [
          'Copier la ressource'
        ]
      },
      follow: {
        order: 10,
        actions: [
          'Voir le tableau de bord de la ressource'
        ]
      },
      delete: {
        order: 15,
        actions: [
          'Supprimer la ressource'
        ]
      },
      edit: {
        order: 20,
        actions: [
          'Modifier la ressource',
          'Publier/Dépublier la ressource'
        ]
      },
      administrate: {
        order: 25,
        actions: [
          'Déplacer la ressource',
          'Modifier les permissions des utilisateurs sur la ressource'
        ]
      }
    },

    addPermissions(permissions) {
      this.permissions = merge(this.permissions, permissions)

      return this
    }
  }
}

/**
 * Exposes public parts of the resource module.
 */
export {
  route,
  Resource,
  ResourceEditor,
  ResourcePage,
  ResourceOverview,
  selectors,
  declareResource
}
