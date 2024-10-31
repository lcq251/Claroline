import {route as adminRoute} from '#/main/core/administration/routing'

function route(organization, basePath = null) {
  if (basePath) {
    return basePath + '/' + organization.id
  }

  return adminRoute('organizations') + '/' + organization.id
}

export {
  route
}
