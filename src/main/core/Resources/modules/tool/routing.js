
function route(toolName, basePath = null) {
  if (toolName && basePath) {
    return `${basePath}/${toolName}`
  }

  if (toolName) {
    return `/desktop/${toolName}`
  }

  return '/desktop'
}

export {
  route
}
