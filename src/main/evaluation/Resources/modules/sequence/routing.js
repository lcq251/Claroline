import {route as toolRoute} from '#/main/core/tool/routing'

function route(sequence, step = null, basePath = null) {
  let sequencePath

  if (basePath) {
    sequencePath = basePath
  } else {
    sequencePath = toolRoute('progression')
  }

  sequencePath = `${sequencePath}/sequences/${sequence.id}`

  if (step) {
    return `${sequencePath}/play/${step.id}`
  }

  return sequencePath
}

export {
  route
}
