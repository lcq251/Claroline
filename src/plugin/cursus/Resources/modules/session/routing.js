import {route as toolRoute} from '#/main/core/tool/routing'

function route(session = null, basePath = null) {
  if (basePath) {
    return basePath + '/sessions/' + session.id
  }

  return toolRoute('trainings') + '/sessions/' + session.id
}

export {
  route
}
