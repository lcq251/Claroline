/**
 * Resource inputs API endpoints (mindme-aibase bundle).
 */

const API = (hostId) => `/apiv2/mindme_aibase/resource_reference/${hostId}/inputs`

/** Per-user ("my links") endpoints for the current logged-in user. */
const MY_API = (hostId) => `/apiv2/mindme_aibase/resource_reference/${hostId}/inputs/mine`

export {
  API,
  MY_API
}