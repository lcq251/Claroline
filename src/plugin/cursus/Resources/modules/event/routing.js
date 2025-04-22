import {route as toolRoute} from '#/main/core/tool/routing'

function route(event, basePath = null) {
  if (basePath) {
    return basePath + '/events/' + event.id
  }

  return toolRoute('trainings') + '/events/' + event.id
}

export {
  route
}
