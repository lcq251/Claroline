import {route} from '#/main/core/resource/routing'
import {ResourceMain as Resource} from '#/main/core/resource/components/main'
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
    ...additional
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
